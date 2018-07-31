import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'cenit-tenant-selector',
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.css']
})
export class TenantSelectorComponent implements OnInit {

  tenants = [
    {
      'id': '5a880d90ce507613b20000cb',
      'name': 'mac@cenit.io'
    },
    {
      'id': '5aba6c63ce507635c7000007',
      'name': 'Shopify'
    },
    {
      'id': '5ad7a353ce507656ad000003',
      'name': 'Principal'
    },
    {
      'id': '5ad7a434ce507656ad000013',
      'name': 'Secondary'
    },
    {
      'id': '5af09f4fce50760948000003',
      'name': 'x'
    },
    {
      'id': '5afc5a3fce507650b3000009',
      'name': 'Swagger'
    },
    {
      'id': '5b2134afce50762851000003',
      'name': 'Slack'
    },
    {
      'id': '5b22b70dce507629f9000003',
      'name': 'Trello'
    },
    {
      'id': '5b2668bbce50762041000003',
      'name': 'Files'
    },
    {
      'id': '5b3bfb03ce50766a13000003',
      'name': 'Properties'
    },
    {
      'id': '5b50bf0ace50765575000002',
      'name': 'audrey@cenit.io'
    },
    {
      'id': '5b5daf91ce50762c01000003',
      'name': 'Cenit UI'
    }];

  current_tenant = {
    'id': '5b5daf91ce50762c01000003',
    'name': 'Cenit UI'
  };

  constructor(private authService: AuthService) {
  }

  ngOnInit() {

  }

  selectTenant(id: string) {

  }
}
