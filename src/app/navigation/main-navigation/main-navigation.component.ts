import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'cenit-navigation-main',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css'],
  animations: [
    trigger('labels', [
      state('showing', style({width: '200px'})),
      state('hiding', style({width: '0px'})),
      transition('showing <=> hiding', [
        animate(300)
      ])
    ])
  ]
})
export class MainNavigationComponent implements OnInit {

  @Output() itemSelected = new EventEmitter();
  @Input() showLabels = false;
  @Input() switchLabelsEnabled = false;

  defaultTypes = [];
  types = this.defaultTypes;
  items = [
    {
      title: 'Types',
      icon: 'widgets',
      items: this.types
    },
    {
      title: 'Config',
      icon: 'build',
      items: [{
        title: 'Namespaces',
        icon: 'waves',
        path: '/namespace'
      }, {
        title: 'Data Types',
        icon: 'class',
        path: '/data_type_config'
      }]
    }];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    if (!this.switchLabelsEnabled) {
      this.showLabels = true;
    }
    this.loadTypes();
  }

  setSwitchingEnable(enable) {
    this.switchLabelsEnabled = enable;
    this.setLabelsVisible(!enable);
  }

  switchingEnable(): boolean {
    return this.switchLabelsEnabled;
  }

  setLabelsVisible(show) {
    this.showLabels = show;
    if (!this.switchLabelsEnabled) {
      this.showLabels = true;
    }
  }

  loadTypes() {
    const handleError = (error) => {
      this.items[0]['items'] = this.types = this.defaultTypes;
    };
    this.apiService.get(['setup', 'data_type_config'], {
      query: {navigation_link: true},
      template: {viewport: '{slug data_type{namespace title}}'}
    }).subscribe(
      configs => {
        this.apiService.get(['setup', 'namespace'])
          .subscribe(
            namespaces => {
              this.items[0]['items'] = this.types = this.defaultTypes.concat(
                configs['items'].map(
                  config => {
                    const namespace = namespaces['items'].find(
                      ns => ns['name'] === config['data_type']['namespace']
                    );
                    if (namespace) {
                      return {
                        title: namespace['name'] + ' | ' + config['data_type']['title'],
                        icon: 'category',
                        path: '/' + namespace['slug'] + '~' +
                        '' + config['slug']
                      };
                    }
                    return null;
                  }
                ).filter(item => item)
              );
            },
            handleError
          );
      },
      handleError
    );
  }

  itemClicked() {
    this.itemSelected.emit();
  }
}
