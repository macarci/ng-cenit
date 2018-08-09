import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Observable, Observer} from 'rxjs';
import {LazyLoaderComponent} from '../../../components/lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-tenant-selector',
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.css']
})
export class TenantSelectorComponent implements OnInit {

  @ViewChild('lazy_loader') lazyLoader: LazyLoaderComponent;

  apiRequest: Observable<Object>;
  apiResponse: Observer<Object>;

  tenants: Object;
  showQuery: boolean;
  nameQuery: string;
  typingTimer: number;

  currentName: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.requestCurrentTenant();
    this.requestTenants();
  }

  requestCurrentTenant() {
    this.apiService.get(['setup', 'user', 'me']).subscribe(
      user => {
        this.currentName = user['account']['name'];
      }
    );
  }

  requestTenants() {
    const limit = 5;
    this.nameQuery = (this.nameQuery || '').toString().trim();
    const query = {
      only: 'id,name',
      limit: limit.toString()
    };
    if (this.nameQuery.length > 0) {
      console.log('Query ', this.nameQuery);
      query['name'] = JSON.stringify({'$regex': '(?i)' + this.nameQuery});
    }
    this.apiRequest = this.apiService.get(['setup', 'account'], query);
    this.apiResponse = {
      next: response => {
        console.log('TENANTS', response);
        this.tenants = response['items'];
        this.showQuery = response['count'] > limit || this.nameQuery.length > 0;
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

  selectTenant(id: string) {
    this.nameQuery = null;
    this.apiService.post(['setup', 'user', 'me'], {
      account: {id: id}
    }).subscribe(
      () => {
        this.requestCurrentTenant();
      },
      (error) => {
        console.log('ERROR', error);
        this.requestCurrentTenant();
      }
    );
  }

  menuClosed() {
    this.nameQuery = null;
    this.requestTenants();
  }

  typing() {
    if (this.typingTimer) {
      window.clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout(() => {
      this.typingTimer = null;
      this.requestTenants();
    }, 1000);
  }
}
