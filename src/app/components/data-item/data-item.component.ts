import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {MatPaginator} from '@angular/material';
import {DataType, DataTypeService, Property} from '../../services/data-type.service';

@Component({
  selector: 'cenit-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.css']
})
export class DataItemComponent implements OnInit {

  @Input() dataSpec;

  constructor(private apiService: ApiService, private dataTypeService: DataTypeService) {
  }

  ngOnInit() {
  }

  requestData(reload?: boolean) {

  }
}
