import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'cenit-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() menuClick = new EventEmitter<any>();
  pictureUrl: string;
  name: string;
  email: string;

  constructor(private authService: AuthService) {
  }

  doClick(){
    this.menuClick.emit();
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
