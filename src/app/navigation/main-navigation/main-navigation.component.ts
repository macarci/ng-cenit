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
        icon: 'class'
      }, {
        title: 'File Types',
        icon: 'folder'
      }]
    },
    {
      title: 'Storage',
      icon: 'category',
      items: [{
        title: 'Docs',
        icon: 'library_books'
      }, {
        title: 'Files',
        icon: 'archive'
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
