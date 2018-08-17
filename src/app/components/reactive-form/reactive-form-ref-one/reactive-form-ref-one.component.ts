import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Property} from '../../../services/data-type.service';

@Component({
  selector: 'cenit-reactive-form-ref-one',
  templateUrl: './reactive-form-ref-one.component.html',
  styleUrls: ['./reactive-form-ref-one.component.css']
})
export class ReactiveFormRefOneComponent implements OnInit {

  @Input() refControl: FormControl;
  @Input() property: Property;

  title: Promise<string> | string;
  description: Promise<string> | string;

  ngOnInit() {
    this.title = this.property.getTitle();
    this.description = this.property.getSchemaEntry<string>('description');
  }
}
