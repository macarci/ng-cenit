import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cenit-navigation-main',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {

  @Input() showLabels = false;
  @Input() switchLabelsEnabled = true;

  items = [
    {
      title: 'Types',
      icon: 'widgets',
      items: [{
        title: 'Object Types',
        icon: 'class',
        path: '/setup/json_data_type'
      }, {
        title: 'File Types',
        icon: 'folder',
        path: '/setup/file_data_type'
      }]
    },
    {
      title: 'Connectors',
      icon: 'category',
      items: [{
        title: 'Connections',
        icon: 'settings_input_component',
        path: '/setup/connection'
      }, {
        title: 'Channels',
        icon: 'import_export',
        path: '/setup/channel'
      }]
    }];

  ngOnInit() {
    if (!this.switchLabelsEnabled) {
      this.showLabels = true;
    }
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

}
