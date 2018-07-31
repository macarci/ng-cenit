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
  name: string;
  email: string;

  constructor(private authService: AuthService) {
  }

  switchSideNav(): boolean {
    this.fixedSideNav = !this.fixedSideNav;
    return this.fixedSideNav;
  }

  ngOnInit() {
    const idToken = this.authService.getIdToken();
    if (idToken) {
      this.pictureUrl = idToken['picture'];
      this.name = idToken['name'];
      this.email = idToken['email'];
    }
  }

  signOut() {
    this.authService.signOut();
  }
}
