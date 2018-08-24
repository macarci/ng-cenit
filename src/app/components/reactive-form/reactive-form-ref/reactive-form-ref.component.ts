import {Component, Input, OnInit} from '@angular/core';
import {Property} from '../../../services/data-type.service';

@Component({
  selector: 'cenit-reactive-form-ref',
  template: ''
})
export class ReactiveFormRefComponent implements OnInit {

  @Input() data;
  @Input() property: Property;

  title: Promise<string> | string;
  description: Promise<string> | string;

  dataTypeTitle: string;
  queryProps: Property[];
  items: RefItem[];

  ngOnInit() {
    this.data = this.validateData(this.data);
    this.title = this.property.getTitle();
    this.description = this.property.getSchemaEntry<string>('description');
    this.property.dataType.getProps()
      .then(
        (props: Property[]) => {
          Promise.all(props.map(prop => prop.getSchemaEntry<string>('type')))
            .then(
              (types: string[]) => {
                this.queryProps = types.map<Property>(
                  (type, index) => {
                    return type === 'string' ? props[index] : null;
                  }
                ).filter(p => p).slice(0, 4);
                this.controlLoaderComplete();
              }
            ).catch(error => this.controlLoaderError(error));
        }
      ).catch(error => this.controlLoaderError(error));
  }

  protected controlLoaderComplete() {
  }

  protected controlLoaderError(error) {
  }

  requestItems(inputQuery?: string) {
    const limit = 5;
    inputQuery = (inputQuery || '').toString().trim();
    const query = {
      limit: limit.toString()
    };
    if (inputQuery.length > 0) {
      const orQuery = [];
      for (const prop of this.queryProps) {
        const propRegx = {};
        propRegx[prop.name] = {'$regex': '(?i)' + inputQuery};
        orQuery.push(propRegx);
      }
      query['$or'] = JSON.stringify(orQuery);
    }
    this.property.dataType.apiService.get(['setup', 'data_type', this.property.dataType.id, 'digest'], {
      query: query,
      template: {
        viewport: '{_id ' + this.queryProps.map(p => p.name).join(' ') + '}'
      }
    }).subscribe(
      response => {
        this.property.dataType.getTitle()
          .then(
            title => {
              this.items = response['items'].map(item => this.toItem(item));
              this.dataTypeTitle = title;
              this.itemsLoaderComplete();
            }
          ).catch(
          error => this.itemsLoaderError(error)
        );
      },
      error => this.itemsLoaderError(error)
    );
  }

  protected itemsLoaderComplete() {
  }

  protected itemsLoaderError(error) {
  }

  toItem(responseItem: Object): RefItem {
    if (responseItem) {
      const label = responseItem['name'] ||
        responseItem['title'] ||
        responseItem['filename'] ||
        (this.dataTypeTitle + ' ' + responseItem['_id']);
      return {
        id: responseItem['_id'],
        label: label
      };
    }
    return null;
  }

  validateData(data): Object {
    throw new Error('not yet implemented');
  }
}

export interface RefItem {
  id: string;
  label: string;
}
