import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IndexContent} from '../../containers/data-container/data-container.component';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'cenit-data-index',
  templateUrl: './data-index.component.html',
  styleUrls: ['./data-index.component.css']
})
export class DataIndexComponent implements OnInit {

  @ViewChild('actionsDrawer') actionsDrawer: MatSidenav;

  @Input() indexContent: IndexContent;

  actions: Array<string>;
  currentAction = 0;

  ngOnInit() {
    this.actions = [''].concat(IndexContent.ACTIONS);
  }

  selectAction(index: number) {
    this.currentAction = index;
    this.actionsDrawer.close();
  }
}
