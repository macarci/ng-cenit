import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {DataType, DataTypeService} from '../../services/data-type.service';

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
    private location: Location,
    private dataTypeService: DataTypeService) {
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
      content.dataTypeService = this.dataTypeService;
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

export class Action {
  constructor(
    readonly key: string,
    readonly name: string,
    readonly  icon: string
  ) {
  }
}

export class DataContent {

  static ACTIONS: Array<Action> = [
    new Action('dashboard', 'Dashboard', 'dashboard')
  ];

  public dataTypeService: DataTypeService;

  static from(url: string): DataContent {
    const params = url.split('/');
    while (params.length > 0 && params[0].length === 0) {
      params.shift();
    }
    if (params.length === 3) {
      return new ItemContent(params[0], params[1], params[2]);
    } else {
      if (params.length === 2) {
        if (IndexContent.ACTIONS.findIndex((a: Action) => a.key === params[1]) === -1) {
          return new ItemContent(params[0], params[1], '');
        } else {
          return new IndexContent(params[0], params[1]);
        }
      } else {
        if (params.length > 0 && DataContent.ACTIONS.findIndex((a: Action) => a.key === params[0]) === -1) {
          return new IndexContent(params[0], '');
        }
        return new DataContent(params[0] || 'dashboard');
      }
    }
  }

  constructor(readonly type: string) {
  }

  getAllowedActions(): Array<Action> {
    return DataContent.ACTIONS;
  }

  getKey(): string {
    return this.type;
  }

  getPath(): string[] {
    return [this.type];
  }
}

export class ModelContent extends DataContent {

  public action: Action;

  dataTypeId: string;
  dataTypePromise: Promise<DataType>;

  protected constructor(type: string, readonly model: string, actionKey: string) {
    super(type);
    this.setAction(actionKey || '');
  }

  setAction(key: string) {
    this.action = this.getAllowedActions().find((a: Action) => a.key === key);
  }

  getActionIndex(): number {
    return this.getAllowedActions().indexOf(this.action);
  }

  getKey(): string {
    return this.model;
  }

  getModelApiParams(): string[] {
    const params = this.model.split('~');
    if (params.length === 1) {
      return ['setup', params[0]];
    }
    return [params.shift(), params.join('~')];
  }

  getApiParams(): string[] {
    return this.getModelApiParams();
  }

  async getDataType(): Promise<DataType> {
    if (!this.dataTypePromise) {
      if (this.dataTypeId) {
        this.dataTypePromise = this.dataTypeService.getById(this.dataTypeId);
      } else {
        this.dataTypePromise = new Promise<DataType>(
          (resolve, reject) => {
            const handleError = error => reject(error);
            this.dataTypeService.apiService.get(this.getModelApiParams(), {query: {limit: 0}})
              .subscribe(
                response => {
                  this.dataTypeId = response['data_type']['_id'];
                  this.dataTypeService.getById(this.dataTypeId)
                    .then((dataType: DataType) => resolve(dataType))
                    .catch(handleError);
                },
                handleError
              );
          }
        );
      }
    }
    return await this.dataTypePromise;
  }
}

export class IndexContent extends ModelContent {

  static ACTIONS: Array<Action> = [
    new Action('', 'List', 'list'),
    new Action('new', 'New', 'add')
  ];

  constructor(model: string, actionKey: string) {
    super('index', model, actionKey);
  }

  getAllowedActions(): Array<Action> {
    return IndexContent.ACTIONS;
  }

  getPath(): string[] {
    if (this.action.key.length === 0) {
      return [this.model];
    }
    return [this.model, this.action.key];
  }
}

export class ItemContent extends ModelContent {

  static ACTIONS: Array<Action> = [
    new Action('', 'Info', 'info'),
    new Action('edit', 'Edit', 'edit'),
    new Action('delete', 'Delete', 'delete')
  ];

  constructor(model: string, private id: any, action: string) {
    super('item', model, action);
  }

  getAllowedActions(): Array<Action> {
    return ItemContent.ACTIONS;
  }

  getKey(): string {
    return super.getKey() + '/' + this.id;
  }

  getPath(): string[] {
    if (this.action.key.length === 0) {
      return [this.model, this.id];
    }
    return [this.model, this.id, this.action.key];
  }

  getApiParams(): string[] {
    return super.getApiParams().concat(this.id);
  }
}
