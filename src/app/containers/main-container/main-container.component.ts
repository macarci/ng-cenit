import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cenit-container-main',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent {

  fixedSideNav = true;

  constructor() {
  }

  switchSideNav(): boolean {
    return this.fixedSideNav = !this.fixedSideNav;
  }
}
