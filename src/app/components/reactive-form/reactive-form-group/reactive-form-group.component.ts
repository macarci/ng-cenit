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

  ngOnInit() {
    this.title = this.title || this.property.getTitle();
    this.description = this.property.getSchemaEntry('description');
    if (this.controls){
      this.delete();
    } else {
      this.loadForm();
    }
  }

  loadForm() {
    this.blank = this.hidden = false;
    this.label = '<new>';
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
          ctrls.forEach(
            ctrl => this.componentFormGroup.addControl(ctrl.prop.name, ctrl.control)
          );
          this.propControls = ctrls;
          if (this.parentControl.constructor === FormGroup) {
            (<FormGroup>this.parentControl).setControl(this.property.name, this.componentFormGroup);
          } else {
            (<FormArray>this.parentControl).setControl(+this.property.name, this.componentFormGroup);
          }
          this.lazyLoader.complete();
        })
          .catch(error => this.lazyLoader.error(error));
      })
      .catch(error => this.lazyLoader.error(error));
  }

  delete() {
    this.hidden = this.blank = true;
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
}
