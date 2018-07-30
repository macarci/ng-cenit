import {Component} from '@angular/core';

@Component({
  selector: 'app-container-main',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent {
  fixedSideNav = true;

  switchSideNav(): boolean {
    this.fixedSideNav = !this.fixedSideNav;
    return this.fixedSideNav;
  }
}
