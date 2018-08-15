import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseFieldControlComponent} from '../reactive-field.component';
import {LazyLoaderComponent} from '../../../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-enum-control',
  templateUrl: './enum-control.component.html',
  styleUrls: ['./enum-control.component.css']
})
export class EnumControlComponent extends BaseFieldControlComponent {

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  enumValues: string[];
  enumLabels: string[];

  ngOnInit() {
    super.ngOnInit();
    this.property.getSchema()
      .then(
        schema => {
          this.enumValues = schema['enum'];
          this.enumLabels = schema['enumNames'] || this.enumValues;
          this.lazyLoader.complete();
        }
      )
      .catch(error => this.lazyLoader.error(error));
  }
}
