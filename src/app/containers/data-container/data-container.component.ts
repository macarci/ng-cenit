import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UrlSegment} from '@angular/router/src/url_tree';
import {Location} from '@angular/common';

const ROOT_ACTIONS = ['dashboard'];
const INDEX_ACTIONS = ['new'];
const ITEM_ACTIONS = ['edit'];

@Component({
  selector: 'cenit-container-data',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.css']
})
export class DataContainerComponent implements OnInit {

  contents: Array<Object> = [
    {
      type: 'dashboard',
      key: 'dashboard',
      icon: 'dashboard'
    }
  ];

  currentKey = 'dashboard';
  selectedIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
  }

  ngOnInit() {
    this.route.url.subscribe((urlSegments: UrlSegment[]) => {
      this.activateCurrentPath();
    });
  }

  activateCurrentPath() {
    const params = this.router.url.split('/');
    params.shift();
    const content = {};
    if (params.length === 3) {
      content['type'] = 'item';
      content['action'] = params[2];
      content['itemId'] = params[1;
      content['model'] = params[0];
      this.currentKey = `${params[0]}/${params[1]}`;
    } else {
      this.currentKey = params[0];
      if (params.length === 2) {
        if (INDEX_ACTIONS.indexOf(params[1]) === -1) {
          content['type'] = 'item';
          content['action'] = '';
          content['itemId'] = params[1];
          content['model'] = params[0];
          this.currentKey = `${params[0]}/${params[1]}`;
        } else {
          content['type'] = 'index';
          content['action'] = params[1];
          content['model'] = params[0];
        }
      } else {
        if (ROOT_ACTIONS.indexOf(params[0]) === -1) {
          content['type'] = 'index';
          content['action'] = '';
          content['model'] = params[0];
        } else {
          content['type'] = params[0];
        }
      }
    }
    let index = this.contents.findIndex((c) => {
      return c['key'] === this.currentKey;
    });
    if (index === -1) {
      content['key'] = this.currentKey;
      this.contents.push(content);
      index = this.contents.length - 1;
    }
    setTimeout(() => {
      this.selectedIndex = index;
    });
  }

  private keyFor(url: string): string {
    const params = url.split('/');
    params.shift();
    if (params.length === 3) {
      return `${params[0]}/${params[1]}`;
    }
    if (params.length === 2) {
      if (INDEX_ACTIONS.indexOf(params[1]) === -1) {
        return `${params[0]}/${params[1]}`;
      }
    }
    return params[0];
  }

  removeIndex(index: number) {
    const indexKey = this.contents[index]['key'];
    this.contents.splice(index, 1);
    if (indexKey === this.currentKey) {
      this.router.navigate([this.contents[index - 1]['key']]);
    } else if (index < this.selectedIndex) {
      setTimeout(() => {
        this.selectedIndex--;
      });
    }
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
    const path = '/' + this.contents[index]['key'];
    this.location.replaceState(path);
  }
}
