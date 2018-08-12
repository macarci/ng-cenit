import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {MatPaginator} from '@angular/material';
import {DataType, DataTypeService, Property} from '../../services/data-type.service';

@Component({
  selector: 'cenit-data-index',
  templateUrl: './data-index.component.html',
  styleUrls: ['./data-index.component.css']
})
export class DataIndexComponent implements OnInit {

  @ViewChild('lazy_loader') lazyLoader: LazyLoaderComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() dataSpec;

  params: string[];

  dataType: DataType;
  data: Object;
  items = [];
  count = 0;
  pageSize = 25;
  properties: Property[];

  displayedColumns: string[];

  constructor(private apiService: ApiService, private dataTypeService: DataTypeService) {
  }

  ngOnInit() {
    const params = this.dataSpec['model'].split('~');
    if (params.length === 1) {
      this.params = ['setup', params[0]];
    } else {
      this.params = [params.shift(), params.join('~')];
    }
    this.lazyLoader.lazy = this.lazyLoader;
    this.requestData();
  }

  requestData(reload?: boolean) {
    this.data = this.dataType = null;
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    this.lazyLoader.loader = new Observable<String>(subscriber => {
      const handleError = (error) => {
        subscriber.error(error);
      };
      subscriber.next('Loading data...');
      this.apiService.get(this.params, {query: {page: page}}).subscribe(
        response => {
          this.data = response;
          this.items = response['items'];
          this.count = response['count'];
          subscriber.next('Resolving data type...');
          this.dataTypeService.getById(this.data['data_type']['_id'])
            .then(
              (dataType: DataType) => {
                this.dataType = dataType;
                subscriber.next('Loading properties...');
                dataType.getProps().then(
                  (props: Property[]) => {
                    this.properties = props;
                    this.displayedColumns = props.map(p => p.name);
                    subscriber.complete();
                  }
                ).catch(handleError);
              }).catch(handleError);
        },
        handleError
      );
    });
    if (reload) {
      this.lazyLoader.reload();
    }
  }
}
