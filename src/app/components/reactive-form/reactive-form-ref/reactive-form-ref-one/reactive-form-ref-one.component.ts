import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LazyLoaderComponent} from '../../../lazy-loader/lazy-loader.component';
import {MatMenuTrigger} from '@angular/material';
import {ReactiveFormRefComponent, RefItem} from '../reactive-form-ref.component';

@Component({
  selector: 'cenit-reactive-form-ref-one',
  templateUrl: './reactive-form-ref-one.component.html',
  styleUrls: ['./reactive-form-ref-one.component.css']
})
export class ReactiveFormRefOneComponent extends ReactiveFormRefComponent {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('controlLoader') controlLoader: LazyLoaderComponent;
  @ViewChild('menuLoader') menuLoader: LazyLoaderComponent;

  @Input() refControl: FormGroup;

  typingTimer: number;

  pickedItem: RefItem;

  requestItems(inputQuery?: string) {
    super.requestItems(inputQuery || this.input.nativeElement.value);
    this.menuLoader.reload();
  }

  protected controlLoaderComplete() {
    if (this.data) {
      this.property.dataType.apiService.get(['setup', 'data_type', this.property.dataType.id, 'digest'], {
        query: {id: this.data['_id']},
        template: {
          viewport: '{_id ' + this.queryProps.map(p => p.name).join(' ') + '}'
        }
      }).subscribe(
        response => {
          this.pickItem(this.toItem(response['items'][0]));
          this.controlLoader.complete();
        },
        error => {
          this.controlLoader.complete();
        }
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

  pickItem(item: RefItem) {
    this.pickedItem = item;
    this.refControl.setValue(item ? {_reference: true, _id: item.id} : null);
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

  validateData(data): Object {
    let id;
    if (data && data.constructor === Object &&
      (id = data['_id'] || data['id']) && id.constructor === String) {
      return {_reference: true, _id: id};
    }
    return null;
  }
}
