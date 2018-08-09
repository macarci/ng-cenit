import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'cenit-container-main',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  fixedSideNav = true;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['dashboard'], {relativeTo: this.route});
    }
  }

  switchSideNav(): boolean {
    return this.fixedSideNav = !this.fixedSideNav;
  }
}
