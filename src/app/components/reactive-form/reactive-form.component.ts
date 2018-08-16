import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DataType, Property} from '../../services/data-type.service';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

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

  onSubmit() {
    console.log('SUBMITTING: ', JSON.stringify(this.dataGroup.value));
  }
}
