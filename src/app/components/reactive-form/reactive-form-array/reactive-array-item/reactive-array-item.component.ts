import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'cenit-reactive-array-item',
  templateUrl: './reactive-array-item.component.html',
  styleUrls: ['./reactive-array-item.component.css']
  // viewProviders: [{provide: ControlContainer, useExisting: NgModelGroup}]
})
export class ReactiveArrayItemComponent {

  @Input() index;
  @Output() delete = new EventEmitter<number>();

  triggerDelete() {
    this.delete.emit(this.index);
  }
}
