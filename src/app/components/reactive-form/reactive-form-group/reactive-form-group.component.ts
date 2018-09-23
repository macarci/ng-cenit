import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';

interface GroupPropertyControl {
  prop: Property;
  control: AbstractControl;
  type: string;
}

@Component({
  selector: 'cenit-reactive-form-group',
  templateUrl: './reactive-form-group.component.html',
  styleUrls: ['./reactive-form-group.component.css']
})
export class ReactiveFormGroupComponent implements OnInit {

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  @Input() data: Object;
  @Input() property: Property;
  @Input() parentControl: FormGroup | FormArray;
  @Input() componentFormGroup: FormGroup;
  @Input() title: Promise<string> | string;
  @Input() controls = true;

  nullControl: FormControl;
  propControls: GroupPropertyControl[];
  description: Promise<string> | string;
  label: Promise<string> | string;
  blank = true;
  hidden = true;
  formLoaded = -1;

  ngOnInit() {
    this.title = this.title || this.property.getTitle();
    this.description = this.property.getSchemaEntry('description');
    this.data = this.validateData(this.data);
    if (this.controls && Object.keys(this.data).length === 0) {
      this.delete();
    } else {
      this.loadForm();
    }
  }

  loadForm() {
    this.formLoaded = 0;
    this.blank = Object.keys(this.data).length === 0;
    this.hidden = this.controls && !this.blank;
    this.label = '<new>';
    const handleLoadFormError = (error) => {
      this.formLoaded = -1;
      this.lazyLoader.error(error);
    };
    this.property.dataType.visibleProps()
      .then((props: Array<Property>) => {
        Promise.all(
          props.map(
            prop => new Promise<GroupPropertyControl>(
              (resolve, reject) => {
                Promise.all([prop.isReferenced(), prop.isMany(), prop.getSchema()])
                  .then(
                    (fullfill: Array<boolean | Object>) => {
                      if (fullfill[0]) { // Referenced
                        if (fullfill[1]) { // Many
                          resolve({
                            prop: prop,
                            control: new FormArray([]),
                            type: 'ref-many'
                          });
                        } else { // One
                          resolve({
                            prop: prop,
                            control: new FormControl(),
                            type: 'ref-one'
                          });
                        }
                      } else {
                        const schema = <Object>fullfill[2];
                        let control: AbstractControl;
                        switch (schema['type']) {
                          case 'object':
                            control = new FormGroup({});
                            break;
                          case 'array':
                            control = new FormArray([]);
                            break;
                          default:
                            control = new FormControl(schema['default']);
                        }
                        resolve({
                          prop: prop,
                          control: control,
                          type: schema['type']
                        });
                      }
                    }
                  )
                  .catch(error => reject(error));
              }
            )
          )
        ).then((ctrls: Array<GroupPropertyControl>) => {
          this.componentFormGroup.removeControl('_reset');
          const resetting = [];
          ctrls.forEach(
            ctrl => {
              this.componentFormGroup.removeControl(ctrl.prop.name);
              this.componentFormGroup.addControl(ctrl.prop.name, ctrl.control);
              if (ctrl.type == 'array' || ctrl.type == 'ref-many') {
                resetting.push(ctrl.prop.name);
              }
            }
          );
          this.componentFormGroup.addControl('_reset', new FormControl(resetting));
          this.propControls = ctrls;
          if (this.parentControl.constructor === FormGroup) {
            (<FormGroup>this.parentControl).setControl(this.property.name, this.componentFormGroup);
          } else {
            (<FormArray>this.parentControl).setControl(+this.property.name, this.componentFormGroup);
          }
          this.formLoaded = 1;
          this.lazyLoader.complete();
        })
          .catch(handleLoadFormError);
      })
      .catch(handleLoadFormError);
  }

  delete() {
    this.hidden = this.blank = true;
    this.formLoaded = -1;
    this.data = {};
    this.label = null;
    if (!this.nullControl) {
      this.nullControl = new FormControl(null);
    }
    if (this.parentControl.constructor === FormGroup) {
      (<FormGroup>this.parentControl).setControl(this.property.name, this.nullControl);
    } else {
      (<FormArray>this.parentControl).setControl(+this.property.name, this.nullControl);
    }
  }

  setData(data: Object) {
    this.data = this.validateData(data);
    this.loadForm();
  }

  validateData(data): Object {
    if (!data || data.constructor !== Object) {
      data = {};
    }
    return data;
  }
}
