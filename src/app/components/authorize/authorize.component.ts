import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'cenit-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];

    if ((code && state) || this.authService.isAuthenticated()) {
      this.check(code, state);
    } else if (!this.error) {
      console.log('Authorizing.......');
      this.authService.authorize();
    }
  }

  check(code?: string, state?: string) {
    this.authService.checkAuthState({
      code: code,
      state: state
    }).subscribe(
      null,
      (error) => {
        this.error = error;
      },
      () => {
        console.log('Redirecting HOME...');
        this.router.navigate(['/dashboard']);
      }
    );
  }
}
