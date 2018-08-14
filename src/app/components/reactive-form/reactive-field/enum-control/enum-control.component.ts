import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'cenit-enum-control',
  templateUrl: './enum-control.component.html',
  styleUrls: ['./enum-control.component.css']
})
export class EnumControlComponent implements OnInit {

  @Input() name: string;
  @Input() fieldControl: FormControl;
  @Input() fieldSchema: Object;

  options: string[][] = [];

  ngOnInit() {
    const enumValues = this.fieldSchema['enum'];
    const enumLabels = this.fieldSchema['enumNames'] || enumValues;
    for (let i = 0; i < enumValues.length; i++){
      this.options.push([enumValues[i], enumLabels[i] || enumValues[i]]);
    }
  }
}
