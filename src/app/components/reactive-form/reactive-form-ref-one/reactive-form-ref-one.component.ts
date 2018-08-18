import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';
import {MatMenuTrigger} from '@angular/material';

@Component({
  selector: 'cenit-reactive-form-ref-one',
  templateUrl: './reactive-form-ref-one.component.html',
  styleUrls: ['./reactive-form-ref-one.component.css']
})
export class ReactiveFormRefOneComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('controlLoader') controlLoader: LazyLoaderComponent;
  @ViewChild('menuLoader') menuLoader: LazyLoaderComponent;

  @Input() refControl: FormGroup;
  @Input() property: Property;

  title: Promise<string> | string;
  description: Promise<string> | string;


  dataTypeTitle: string;
  items: Array<RefItem>;
  typingTimer: number;

  pickedItem: RefItem;
  queryProps: Property[];

  ngOnInit() {
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
                ).filter(p => p);
                this.controlLoader.complete();
              }
            ).catch(error => this.controlLoader.error(error));
        }
      ).catch(error => this.controlLoader.error(error));
  }

  requestItems() {
    const limit = 5;
    const inputQuery = (this.input.nativeElement.value || '').toString().trim();
    const query = {
      limit: limit.toString()
    };
    if (inputQuery.length > 0) {
      for (const prop of this.queryProps) {
        query[prop.name] = JSON.stringify({'$regex': '(?i)' + inputQuery});
      }
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
              this.menuLoader.complete();
            }
          ).catch(
          error => this.menuLoader.error(error)
        );
      },
      error => this.menuLoader.error(error)
    );
    this.menuLoader.reload();
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

  pickItem(item: RefItem) {
    this.pickedItem = item;
    this.refControl.setValue(item ? {_id: item.id} : null);
    this.input.nativeElement.value = item ? item.label : null;
  }

  menuClosed() {
    this.pickItem(this.pickedItem);
  }

  typing() {
    if (this.typingTimer) {
      window.clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout(() => {
      this.typingTimer = null;
      this.requestItems();
      this.trigger.openMenu();
    }, 1000);
  }
}

export interface RefItem {
  id: string;
  label: string;
}
