import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ApiService} from '../../../services/api.service';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'cenit-tenant-selector',
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.css']
})
export class TenantSelectorComponent implements OnInit {

  apiRequest: Observable<Object>;
  apiResponse: Observer<Object>;

  tenants: Object;
  showQuery: boolean;
  nameQuery: string;

  current_tenant = {
    'id': '5b5daf91ce50762c01000003',
    'name': 'Cenit UI'
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.configRequest();
  }

  configRequest() {
    const limit = 5;
    this.nameQuery = (this.nameQuery || '').toString().trim();
    const query = {limit: limit.toString()};
    if (this.nameQuery.length > 0) {
      console.log('Query ', this.nameQuery);
      query['name'] = JSON.stringify({'$regex': '(?i)' + this.nameQuery});
    }
    this.apiRequest = this.apiService.find('setup', 'account', query);
    this.apiResponse = {
      next: response => {
        console.log('TENATSSSSSSSSSSSSSSSSS', response);
        this.tenants = response['accounts'];
        this.showQuery = response['count'] > limit || this.nameQuery.length > 0;
      },
      error: err => {
      },
      complete: () => {
      }
    };
  }

  selectTenant(id: string) {
    this.nameQuery = null;
  }
}
