import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'cenit-boolean-control',
  templateUrl: './boolean-control.component.html',
  styleUrls: ['./boolean-control.component.css']
})
export class BooleanControlComponent {

  @Input() name: string;
  @Input() fieldControl: FormControl;

}
