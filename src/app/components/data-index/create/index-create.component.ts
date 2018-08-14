import {Component, Input, OnInit} from '@angular/core';
import {IndexContent} from '../../../containers/data-container/data-container.component';
import {DataType} from '../../../services/data-type.service';

@Component({
  selector: 'cenit-data-index-create',
  templateUrl: './index-create.component.html',
  styleUrls: ['./index-create.component.css']
})
export class IndexCreateComponent implements OnInit {

  @Input() indexContent: IndexContent;

  dataTypePromise: Promise<DataType>;

  ngOnInit() {
    this.dataTypePromise = this.indexContent.getDataType();
  }
}
