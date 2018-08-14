import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-reactive-form-array',
  templateUrl: './reactive-form-array.component.html',
  styleUrls: ['./reactive-form-array.component.css']
  // viewProviders: [{provide: ControlContainer, useExisting: NgModelGroup}]
})
export class ReactiveFormArrayComponent implements OnInit {

  @Input() name: string;
  @Input() property: Property;
  @Input() componentFormArray: FormArray;

  @ViewChild(LazyLoaderComponent) lazyLoader;
  itemsSchema: Object;
  itemControls: Array<{ control: AbstractControl; prop: Property }>;

  constructor() {
  }

  ngOnInit() {
    this.name = this.name || this.property.name;
    this.itemControls = [];
    this.property.dataType.getSchema()
      .then(
        (schema: Object) => {
          this.itemsSchema = schema;
          this.lazyLoader.complete();
        })
      .catch(error => this.lazyLoader.error(error));
    console.log(this.name, 'ARRAY INITIALIZED');
  }

  addNewItem() {
    const control = this.controlFor(this.itemsSchema);
    this.itemControls.push({
      control: control,
      prop: new Property(this.itemControls.length.toString(), this.property.dataType)
    });
    this.componentFormArray.push(control);
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
