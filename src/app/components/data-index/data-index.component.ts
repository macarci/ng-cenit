import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Action, IndexContent} from '../../containers/data-container/data-container.component';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'cenit-data-index',
  templateUrl: './data-index.component.html',
  styleUrls: ['./data-index.component.css']
})
export class DataIndexComponent implements OnInit {

  @ViewChild('actionsDrawer') actionsDrawer: MatSidenav;

  @Input() indexContent: IndexContent;

  actions: Array<Action>;
  currentIndex = 0;

  constructor(private location: Location) {
  }

  ngOnInit() {
    this.actions = IndexContent.ACTIONS;
    this.currentIndex = this.indexContent.getActionIndex();
  }

  selectAction(index: number) {
    this.currentIndex = index;
    this.actionsDrawer.close();
    this.indexContent.action = this.actions[index];
    this.location.replaceState(this.indexContent.getPath().join('/'));
  }
}
