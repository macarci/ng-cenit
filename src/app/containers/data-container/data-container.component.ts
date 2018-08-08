import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'cenit-container-data',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.css']
})
export class DataContainerComponent implements OnInit {

  contents: Array<Object> = [
    {
      type: 'dashboard',
      icon: 'dashboard',
      path: '/dashboard'
    }
  ];

  selectedIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.activateCurrentPath();
    });
  }

  activateCurrentPath() {
    let index = this.contents.findIndex((c) => {
      return c['path'] === this.router.url;
    });
    if (index === -1) {
      this.contents.push({
        icon: 'info',
        path: this.router.url,
        type: 'index'
      });
      index = this.contents.length - 1;
    }
    setTimeout(() => {
      this.selectedIndex = index;
    });
  }

  removeIndex(index: number) {
    const indexPath = this.contents[index]['path'];
    this.contents.splice(index, 1);
    if (indexPath === this.router.url) {
      this.router.navigate([this.contents[index - 1]['path']]);
    } else if (index < this.selectedIndex) {
      setTimeout(() => {
        this.selectedIndex--;
      });
    }
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }
}
