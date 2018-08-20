import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material';

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

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  itemsSchema: Object;
  itemControls: Array<{ control: AbstractControl; prop: Property }>;

  title: Promise<string> | string;
  description: Promise<string> | string;
  label: string;
  hidden = true;

  constructor() {
  }

  ngOnInit() {
    this.title = this.title || this.property.getTitle();
    this.description = this.property.getSchemaEntry('description');
    this.label = null;
    this.name = this.name || this.property.name;
    this.itemControls = [];
    this.property.dataType.getSchema()
      .then(
        (schema: Object) => {
          this.itemsSchema = schema;
          this.lazyLoader.complete();
        })
      .catch(error => this.lazyLoader.error(error));
  }

  addNewItem() {
    const control = this.controlFor(this.itemsSchema);
    this.itemControls.push({
      control: control,
      prop: new Property(this.itemControls.length.toString(), this.property.dataType)
    });
    this.componentFormArray.push(control);
    this.label = this.itemControls.length.toString() + ' items';
    this.tabGroup.selectedIndex = this.itemControls.length - 1;
    this.hidden = false;
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

  deleteAt(index) {
    this.componentFormArray.removeAt(index);
    this.itemControls.splice(index, 1);
    if (this.itemControls.length === 0) {
      this.hidden = true;
      this.label = null;
    } else {
      this.label = this.itemControls.length.toString() + ' items';
    }
  }
}
