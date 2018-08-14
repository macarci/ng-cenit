import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'cenit-reactive-field',
  templateUrl: './reactive-field.component.html',
  styleUrls: ['./reactive-field.component.css']
})
export class ReactiveFieldComponent implements OnInit {

  @Input() fieldSchema: string;
  @Input() name: string;
  @Input() fieldFormControl: FormControl;
  @Input() required: boolean;

  label: string;
  description: string;
  controlType: string;


  ngOnInit() {
    this.label = this.fieldSchema['title'] || this.name;
    this.description = this.fieldSchema['description'];
    this.controlType = this.controlTypeFor(this.fieldSchema);

    console.log(this.name, 'CONTROL INITIALIZED');
  }

  controlTypeFor(schema) {
    switch (schema['type']) {
      case 'string': {
        if (schema['enum'] instanceof Array) {
          return 'enum';
        }
        switch (schema['format']) {
          default:
            return 'string';
        }
      }
      default:
        return schema['type'];
    }
  }
}
