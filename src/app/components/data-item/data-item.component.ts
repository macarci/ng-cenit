import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {DataTypeService} from '../../services/data-type.service';
import {ItemContent} from '../../containers/data-container/data-container.component';

@Component({
  selector: 'cenit-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.css']
})
export class DataItemComponent implements OnInit {

  @Input() itemContent: ItemContent;

  constructor(private apiService: ApiService, private dataTypeService: DataTypeService) {
  }

  ngOnInit() {
  }

  requestData(reload?: boolean) {

  }
}
