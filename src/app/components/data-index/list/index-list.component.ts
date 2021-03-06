import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Observable} from 'rxjs';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';
import {MatPaginator} from '@angular/material';
import {DataType, DataTypeService, Property} from '../../../services/data-type.service';
import {IndexContent} from '../../../containers/data-container/data-container.component';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'cenit-data-index-list',
  templateUrl: './index-list.component.html',
  styleUrls: ['./index-list.component.css']
})
export class IndexListComponent implements OnInit {

  @ViewChild('lazy_loader') lazyLoader: LazyLoaderComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() indexContent: IndexContent;

  dataType: DataType;
  data: Object;
  items = [];
  count = 0;
  pageSize = 25;
  indexProperties: Property[];

  displayedColumns: string[];
  selection = new SelectionModel<Object>(true, []);


  constructor(private apiService: ApiService, private dataTypeService: DataTypeService) {
  }

  ngOnInit() {
    this.lazyLoader.lazy = this.lazyLoader;
    this.requestData();
  }

  requestData(reload?: boolean) {
    this.data = null;
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    this.lazyLoader.loader = new Observable<String>(subscriber => {
      const handleError = (error) => {
        subscriber.error(error);
      };
      subscriber.next('Loading data...');
      this.apiService.get(this.indexContent.getApiParams(), {query: {page: page}}).subscribe(
        response => {
          this.data = response;
          this.items = response['items'].map(
            item => {
              return {...item, '$actions': '/' + this.indexContent.getApiParams().join('~') + '/' + item['_id']};
            }
          );
          this.selection.clear();
          this.count = response['count'];
          if (this.dataType) {
            subscriber.complete();
          } else {
            subscriber.next('Resolving data type...');
            this.indexContent.getDataType()
              .then((dataType: DataType) => {
                this.dataType = dataType;
                subscriber.next('Loading properties...');
                this.captureIndexProperties()
                  .then(() => subscriber.complete())
                  .catch(handleError);
              }).catch(handleError);
          }
        },
        handleError
      );
    });
    if (reload) {
      this.lazyLoader.reload();
    }
  }

  private captureIndexProperties(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        const handleError = error => reject(error);
        if (this.dataType) {
          this.dataType.getProps().then(
            (props: Property[]) => {
              Promise.all(
                props.map(
                  p => new Promise<Property>(
                    (res, rej) => {
                      Promise.all([p.isSimple(), p.isVisible()])
                        .then(
                          takeIt => res(takeIt[0] && takeIt[1] ? p : null)
                        )
                        .catch(e => rej(e));
                    }
                  ))
              ).then(
                (indexProps: Array<Property>) => {
                  this.indexProperties = indexProps.filter(p => p);
                  this.displayedColumns = [
                    '$select',
                    ...this.indexProperties.map(p => p.name),
                    '$actions'
                  ];
                  resolve();
                }
              ).catch(handleError);
            }
          ).catch(handleError);
        } else {
          reject('No data type');
        }
      }
    );
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.items.length;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.items.forEach(item => this.selection.select(item));
    }
  }
}
