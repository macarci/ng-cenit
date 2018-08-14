import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'cenit-reactive-form-array',
  templateUrl: './reactive-form-array.component.html',
  styleUrls: ['./reactive-form-array.component.css']
  // viewProviders: [{provide: ControlContainer, useExisting: NgModelGroup}]
})
export class ReactiveFormArrayComponent implements OnInit {

  @Input() name: string;
  @Input() arraySchema: Object;
  @Input() componentFormArray: FormArray;

  itemsSchema: Object;

  constructor() {
  }

  ngOnInit() {
    this.itemsSchema = this.arraySchema['items'];

    console.log(this.name, 'ARRAY INITIALIZED');
  }

  addNewItem() {
    this.componentFormArray.push(this.controlFor(this.itemsSchema));
  }

  controlFor(schema): AbstractControl {
    switch (schema['type']) {
      case 'object':
        return new FormGroup({});
      case 'array':
        return new FormArray([]);
      default:
        return new FormControl(schema['default']);
    }
  }

  handleItemDeleted(index) {
    this.componentFormArray.removeAt(index);
  }
}
