import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fixedSideNav = true;

  switchSideNav(): boolean {
    this.fixedSideNav = !this.fixedSideNav;
    return this.fixedSideNav;
  }
}
