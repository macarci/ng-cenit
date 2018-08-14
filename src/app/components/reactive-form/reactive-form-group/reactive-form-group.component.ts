import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'cenit-reactive-form-group',
  templateUrl: './reactive-form-group.component.html',
  styleUrls: ['./reactive-form-group.component.css']
})
export class ReactiveFormGroupComponent implements OnInit {

  @Input() name: string;
  @Input() groupSchema: Object;
  @Input() componentFormGroup: FormGroup;

  properties: Array<any>;

  constructor() {
  }

  ngOnInit() {
    const required = this.groupSchema['required'] || [];
    this.properties = Object.keys(this.groupSchema['properties']).map(property => {
      const propertySchema = this.groupSchema['properties'][property];
      let validators;
      if (required.indexOf(property) > -1 || propertySchema['required']) {
        validators = Validators.required;
      }
      const control = this.controlFor(propertySchema, validators);
      if (required.indexOf(property) > -1 || propertySchema['required']) {
        control.setValidators(Validators.required);
      }
      this.componentFormGroup.addControl(property, control);
      return {
        name: property,
        schema: propertySchema,
        control: control
      };
    });

    console.log(this.name, 'R-GROUP INITIALIZED', this.properties);
  }

  controlFor(schema, validators): AbstractControl {
    switch (schema['type']) {
      case 'object':
        return new FormGroup({}, validators);
      case 'array':
        return new FormArray([], validators);
      default:
        return new FormControl(schema['default'], validators);
    }
  }
}
