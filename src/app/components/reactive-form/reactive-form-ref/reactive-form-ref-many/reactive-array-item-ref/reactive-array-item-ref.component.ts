import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RefItem} from '../../reactive-form-ref.component';

@Component({
  selector: 'cenit-reactive-array-item-ref',
  templateUrl: './reactive-array-item-ref.component.html',
  styleUrls: ['./reactive-array-item-ref.component.css']
})
export class ReactiveArrayItemRefComponent {

  @Input() item: RefItem;
  @Input() index: number;
  @Output() remove = new EventEmitter<number>();

  over: boolean;
  color = 'primary';

  triggerDelete() {
    this.remove.emit(this.index);
  }

  onOver(over: boolean) {
    if (this.over = over) {
      this.color = 'accent';
    } else {
      this.color = 'primary';
    }
  }
}
