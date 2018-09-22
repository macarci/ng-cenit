import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {MainNavigationComponent} from '../../navigation/main-navigation/main-navigation.component';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'cenit-container-main',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenav) sideNav;
  @ViewChild(MainNavigationComponent) mainNavigation;
  fixedSideNav = true;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private router: Router, private route: ActivatedRoute, mediaMatcher: MediaMatcher) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.queryMedia();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.queryMedia();
    if (this.router.url === '/') {
      this.router.navigate(['dashboard'], {relativeTo: this.route});
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  queryMedia() {
    this.sideNav.toggle(!this.mobileQuery.matches);
    this.mainNavigation.setSwitchingEnable(!this.mobileQuery.matches);
    this.fixedSideNav = false;
  }

  switchSideNav(): boolean {
    return this.fixedSideNav = !this.fixedSideNav;
  }

  menuClicked() {
    if (this.mobileQuery.matches) {
      this.mainNavigation.setSwitchingEnable(false);
      this.sideNav.toggle();
    } else {
      this.mainNavigation.setSwitchingEnable(!this.switchSideNav());
    }
  }

  navItemSelected() {
    if (this.mobileQuery.matches) {
      this.sideNav.toggle();
    } else {
      this.mainNavigation.setLabelsVisible(false);
    }
  }
}
