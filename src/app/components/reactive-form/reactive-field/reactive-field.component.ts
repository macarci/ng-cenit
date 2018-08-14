import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-reactive-field',
  templateUrl: './reactive-field.component.html',
  styleUrls: ['./reactive-field.component.css']
})
export class ReactiveFieldComponent implements OnInit {

  @Input() property: Property;
  @Input() name: string;
  @Input() fieldFormControl: FormControl;
  @Input() required: boolean;

  label: string;
  description: string;
  controlType: string;

  @ViewChild(LazyLoaderComponent) lazyLoader;
  fieldSchema: Object;

  ngOnInit() {
    this.name = this.name || this.property.name;
    this.property.getSchema()
      .then(
        schema => {
          this.fieldSchema = schema;
          this.label = schema['title'] || this.name;
          this.description = schema['description'];
          this.controlType = this.controlTypeFor(schema);
          this.lazyLoader.complete();
        })
      .catch(error => this.lazyLoader.error(error));

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
