import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'cenit-user-link',
  templateUrl: './user-link.component.html',
  styleUrls: ['./user-link.component.css']
})
export class UserLinkComponent implements OnInit {

  pictureUrl: string;
  name: string;
  email: string;

  constructor(private authService: AuthService) {
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
