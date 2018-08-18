import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataType, Property} from '../../services/data-type.service';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-ref-one-picker',
  templateUrl: './ref-one-picker.component.html',
  styleUrls: ['./ref-one-picker.component.css']
})
export class RefOnePickerComponent implements OnInit {

  @Output() refPicked = new EventEmitter<string>();

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  @Input() dataType: DataType;

  dataTypeTitle: string;
  items: Array<RefItem>;
  showQuery: boolean;
  query: string;
  typingTimer: number;

  pickedItem: RefItem;
  queryProps: Property[];

  ngOnInit() {
    this.dataType.getProps()
      .then(
        (props: Property[]) => {
          Promise.all(props.map(prop => prop.getSchemaEntry<string>('type')))
            .then(
              (types: string[]) => {
                this.queryProps = types.map<Property>(
                  (type, index) => {
                    return type === 'string' ? props[index] : null;
                  }
                ).filter(p => p);
              }
            ).catch(error => this.lazyLoader.error(error));
        }
      ).catch(error => this.lazyLoader.error(error));
  }

  requestItems() {
    const limit = 5;
    this.query = (this.query || '').toString().trim();
    const query = {
      limit: limit.toString()
    };
    if (this.query.length > 0) {
      for (const prop of this.queryProps) {
        query[prop.name] = JSON.stringify({'$regex': '(?i)' + this.query});
      }
    }
    this.dataType.apiService.get(['setup', 'data_type', this.dataType.id, 'digest'], {
      query: query,
      template: {
        viewport: '{_id ' + this.queryProps.map(p => p.name).join(' ') + '}'
      }
    }).subscribe(
      response => {
        this.dataType.getTitle()
          .then(
            title => {
              this.items = response['items'].map(item => this.toItem(item));
              this.showQuery = response['count'] > limit || this.query.length > 0;
              this.dataTypeTitle = title;
              this.lazyLoader.complete();
            }
          ).catch(
          error => this.lazyLoader.error(error)
        );
      },
      error => this.lazyLoader.error(error)
    );
    this.lazyLoader.reload();
  }

  toItem(responseItem: Object): RefItem {
    const label = responseItem['name'] ||
      responseItem['title'] ||
      responseItem['filename'] ||
      (this.dataTypeTitle + ' ' + responseItem['_id']);
    return {
      id: responseItem['_id'],
      label: label
    };
  }

  pickItem(id: string) {
    this.query = null;
    this.pickedItem = this.items.find(item => item.id === id);
    this.refPicked.emit(this.pickedItem && this.pickedItem.id);
  }

  menuClosed() {
    this.query = null;
  }

  typing() {
    if (this.typingTimer) {
      window.clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout(() => {
      this.typingTimer = null;
      this.requestItems();
    }, 1000);
  }
}

interface RefItem {
  id: string;
  label: string;
}
