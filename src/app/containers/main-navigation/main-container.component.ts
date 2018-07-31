import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-container-main',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  fixedSideNav = true;
  pictureUrl: string;
  signOutUrl: string;

  constructor(private authService: AuthService) {}

  switchSideNav(): boolean {
    this.fixedSideNav = !this.fixedSideNav;
    return this.fixedSideNav;
  }

  ngOnInit(){
    this.pictureUrl = this.authService.getPictureURL();
    this.signOutUrl = this.authService.getSignOutURL();
  }

  signOut() {
    this.authService.signOut();
  }
}
