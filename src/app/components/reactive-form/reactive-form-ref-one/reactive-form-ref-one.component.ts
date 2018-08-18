import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Property} from '../../../services/data-type.service';

@Component({
  selector: 'cenit-reactive-form-ref-one',
  templateUrl: './reactive-form-ref-one.component.html',
  styleUrls: ['./reactive-form-ref-one.component.css']
})
export class ReactiveFormRefOneComponent implements OnInit {

  @Input() refControl: FormGroup;
  @Input() property: Property;

  title: Promise<string> | string;
  description: Promise<string> | string;

  ngOnInit() {
    this.title = this.property.getTitle();
    this.description = this.property.getSchemaEntry<string>('description');
  }

  pick(id: string) {
    this.refControl.setValue(id && {_id: id});
  }
}
