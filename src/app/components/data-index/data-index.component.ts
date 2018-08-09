import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Observable, Observer} from 'rxjs';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'cenit-data-index',
  templateUrl: './data-index.component.html',
  styleUrls: ['./data-index.component.css']
})
export class DataIndexComponent implements OnInit {

  @ViewChild('lazy_loader') lazyLoader: LazyLoaderComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() dataSpec;

  params: string[];

  apiRequest: Observable<Object>;
  apiResponse: Observer<Object>;
  data: Object;
  items = [];
  count = 0;
  pageSize = 25;

  displayedColumns: string[] = ['id', 'namespace', 'name'];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.params = this.dataSpec['path'].split('/');
    this.params.splice(0, 1);
    this.requestData();
  }

  requestData() {
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    this.apiRequest = this.apiService.get(this.params, {
      page: page.toString()
    });
    this.apiResponse = {
      next: response => {
        console.log(response);
        this.data = response;
        this.items = response['items'];
        this.count = response['count'];
      },
      error: err => {
      },
      complete: () => {
      }
    };
    this.lazyLoader.loader = this.apiRequest;
    this.lazyLoader.lazy = this.apiResponse;
    this.lazyLoader.reload();
  }
}
