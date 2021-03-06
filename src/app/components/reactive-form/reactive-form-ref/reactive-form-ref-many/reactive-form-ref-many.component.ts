import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';
import {LazyLoaderComponent} from '../../../lazy-loader/lazy-loader.component';
import {MatMenuTrigger} from '@angular/material';
import {ReactiveFormRefComponent, RefItem} from '../reactive-form-ref.component';
import {concat} from 'rxjs';

@Component({
  selector: 'cenit-reactive-form-ref-many',
  templateUrl: './reactive-form-ref-many.component.html',
  styleUrls: ['./reactive-form-ref-many.component.css']
})
export class ReactiveFormRefManyComponent extends ReactiveFormRefComponent {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('controlLoader') controlLoader: LazyLoaderComponent;
  @ViewChild('menuLoader') menuLoader: LazyLoaderComponent;

  @Input() componentFormArray: FormArray;

  controlItems: RefItem[] = [];
  hidden = true;
  itemsLabel = null;
  typingTimer: number;

  requestItems(inputQuery?: string) {
    super.requestItems(inputQuery || this.input.nativeElement.value);
    this.menuLoader.reload();
  }

  protected controlLoaderComplete() {
    if (this.data) {
      concat(
        ...(<Array<Object>>this.data).map(
          dataItem => this.property.dataType.apiService.get<Object>(
            ['setup', 'data_type', this.property.dataType.id, 'digest'],
            {
              query: {id: dataItem['_id']},
              template: {
                viewport: '{_id ' + this.queryProps.map(p => p.name).join(' ') + '}'
              }
            })
        )
      ).subscribe(
        response => {
          this.pickItem(this.toItem(response['items'][0]), true);
        },
        error => {
        },
        () => this.controlLoader.complete()
      );
    } else {
      this.controlLoader.complete();
    }
  }

  protected controlLoaderError(error) {
    this.controlLoader.error(error);
  }

  protected itemsLoaderComplete() {
    this.menuLoader.complete();
  }

  protected itemsLoaderError(error) {
    this.menuLoader.error(error);
  }

  removeAt(index: number) {
    if (index >= 0 && index < this.controlItems.length) {
      this.controlItems.splice(index, 1);
      this.componentFormArray.removeAt(index);
      this.updateItemsLabel();
    }
  }

  pickItem(item: RefItem, hidden?: boolean) {
    if (item) {
      this.componentFormArray.setControl(
        this.controlItems.length,
        new FormControl({_reference: true, _id: item.id})
      );
      this.controlItems.push(item);
      this.hidden = hidden || false;
    }
    this.updateItemsLabel();
  }

  updateItemsLabel() {
    if (this.controlItems.length > 0) {
      this.itemsLabel = '' + this.controlItems.length + ' items';
    } else {
      this.itemsLabel = null;
    }
  }

  menuClosed() {
    this.updateItemsLabel();
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

  enableInput() {
    this.itemsLabel = null;
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.requestItems();
    });
  }

  validateData(data): Object[] {
    if (data && data.constructor === Array) {
      return (<Array<any>>data).map<Object>(
        item => {
          let id;
          if (item && item.constructor === Object &&
            (id = item['_id'] || item['id']) && id.constructor === String) {
            return {_reference: true, _id: id};
          }
          return null;
        }
      ).filter(item => item);
    }
    return null;
  }
}
