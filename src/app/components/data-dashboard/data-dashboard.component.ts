import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'cenit-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.css']
})
export class DataDashboardComponent {

  constructor(private apiService: ApiService) {
  }

}
