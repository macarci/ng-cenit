import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'cenit-container-data',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.css']
})
export class DataContainerComponent implements OnInit {

  contents: Array<DataContent> = [new DataContent('dashboard')];

  currentKey = this.contents[0].getKey();
  selectedIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
  }

  ngOnInit() {
    this.route.url.subscribe(() => {
      this.activateCurrentPath();
    });
  }

  activateCurrentPath() {
    const content = DataContent.from(this.router.url);
    this.currentKey = content.getKey();
    let index = this.contents.findIndex((c: DataContent) => {
      return c.getKey() === this.currentKey;
    });
    if (index === -1) {
      this.contents.push(content);
      index = this.contents.length - 1;
    }
    setTimeout(() => {
      this.selectedIndex = index;
    });
  }

  removeIndex(index: number) {
    const indexKey = this.contents[index].getKey();
    this.contents.splice(index, 1);
    if (indexKey === this.currentKey) {
      this.router.navigate(this.contents[index - 1].getPath());
    } else if (index < this.selectedIndex) {
      setTimeout(() => {
        this.selectedIndex--;
      });
    }
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
    this.location.replaceState(this.contents[index].getPath().join('/'));
  }
}

export class DataContent {

  static ACTIONS = ['dashboard'];

  static from(url: string): DataContent {
    const params = url.split('/');
    params.shift();
    if (params.length === 3) {
      return new ItemContent(params[0], params[1], params[2]);
    } else {
      if (params.length === 2) {
        if (IndexContent.ACTIONS.indexOf(params[1]) === -1) {
          return new ItemContent(params[0], params[1], '');
        } else {
          return new IndexContent(params[0], params[1]);
        }
      } else {
        if (DataContent.ACTIONS.indexOf(params[0]) === -1) {
          return new IndexContent(params[0], '');
        } else {
          return new DataContent(params[0]);
        }
      }
    }
  }

  constructor(private type: string) {
  }

  getKey(): string {
    return this.type;
  }

  getPath(): string[] {
    return [this.type];
  }
}

export class ModelContent extends DataContent {
  protected constructor(type: string, protected model: string, public action: string) {
    super(type);
  }

  getKey(): string {
    return this.model;
  }

  getApiParams(): string[] {
    const params = this.model.split('~');
    if (params.length === 1) {
      return ['setup', params[0]];
    }
    return [params.shift(), params.join('~')];
  }
}

export class IndexContent extends ModelContent {

  static ACTIONS = ['new'];

  constructor(model: string, action: string) {
    super('index', model, action);
  }

  getPath(): string[] {
    if (this.action.length === 0) {
      return [this.model];
    }
    return [this.model, this.action];
  }
}

export class ItemContent extends ModelContent {

  static ACTIONS = ['edit'];

  constructor(model: string, private id: any, action: string) {
    super('item', model, action);
  }

  getKey(): string {
    return super.getKey() + '/' + this.id;
  }

  getPath(): string[] {
    if (this.action.length === 0) {
      return [this.model, this.id];
    }
    return [this.model, this.id, this.action];
  }

  getApiParams(): string[] {
    return super.getApiParams().concat(this.id);
  }
}
