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

  @Input() data: any;
  @Input() fieldFormControl: FormControl;
  @Input() property: Property;

  @ViewChild(LazyLoaderComponent) lazyLoader;
  controlType: string;

  ngOnInit() {
    this.property.getSchema()
      .then(
        schema => {
          this.controlType = this.controlTypeFor(schema);
          this.lazyLoader.complete();
        })
      .catch(error => this.lazyLoader.error(error));
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

@Component({
  selector: 'cenit-base-field-control',
  template: ''
})
export class BaseFieldControlComponent implements OnInit {

  @Input() data: any;
  @Input() property: Property;
  @Input() fieldControl: FormControl;

  @ViewChild(LazyLoaderComponent) lazyLoader;

  name: string;
  label: Promise<string> | string;
  description: Promise<string> | string;

  ngOnInit() {
    this.fieldControl.setValue(this.data);
    this.name = this.property.name;
    this.label = this.property.getTitle();
    this.description = this.property.getSchemaEntry<string>('description');
  }
}
