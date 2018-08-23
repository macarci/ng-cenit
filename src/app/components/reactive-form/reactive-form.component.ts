import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DataType, Property} from '../../services/data-type.service';

@Component({
  selector: 'cenit-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  @Output() submit = new EventEmitter<Object>();
  @Input() dataType: DataType;

  title: Promise<string> | string;
  property: Property;
  formGroup: FormGroup;
  dataGroup: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.dataGroup = new FormGroup({});
    this.formGroup = new FormGroup({data: this.dataGroup});
    this.title = this.dataType.getTitle();
    this.property = new Property('data', this.dataType);
  }

  doNothing() {
  }

  getData(): Object {
    return this.dataGroup.value;
  }
}
