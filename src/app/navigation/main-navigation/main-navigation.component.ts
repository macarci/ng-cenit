import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'cenit-navigation-main',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {

  @Input() showLabels = false;
  @Input() switchLabelsEnabled = true;

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
}
