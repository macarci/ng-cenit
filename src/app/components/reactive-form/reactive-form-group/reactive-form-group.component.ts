import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-reactive-form-group',
  templateUrl: './reactive-form-group.component.html',
  styleUrls: ['./reactive-form-group.component.css']
})
export class ReactiveFormGroupComponent implements OnInit {

  @Input() property: Property;
  @Input() name: string;
  @Input() componentFormGroup: FormGroup;

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;
  propControls: Array<{ prop: Property; control: AbstractControl; type: string }>;

  constructor() {
  }

  ngOnInit() {
    this.name = this.name || this.property.name;
    this.property.dataType.getProps()
      .then((props: Array<Property>) => {
        const types: string[] = [];
        Promise.all(
          props.map(
            prop => new Promise<AbstractControl>(
              (resolve, reject) => {
                prop.getSchema()
                  .then(
                    schema => {
                      types.push(schema['type']);
                      switch (schema['type']) {
                        case 'object':
                          resolve(new FormGroup({}));
                          break;
                        case 'array':
                          resolve(new FormArray([]));
                          break;
                        default:
                          resolve(new FormControl(schema['default']));
                      }
                    })
                  .catch(error => reject(error));
              }
            )
          )
        ).then((controls: AbstractControl[]) => {
          this.propControls = controls.map<{ prop: Property; control: AbstractControl; type: string }>(
            (control: AbstractControl, index: number) => {
              this.componentFormGroup.addControl(props[index].name, control);
              return {
                prop: props[index],
                control: control,
                type: types[index]
              };
            }
          );
          this.lazyLoader.complete();
        })
          .catch(error => this.lazyLoader.error(error));
      })
      .catch(error => this.lazyLoader.error(error));
  }
}
