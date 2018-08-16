import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IndexContent} from '../../../containers/data-container/data-container.component';
import {DataType} from '../../../services/data-type.service';
import {LazyLoaderComponent} from '../../lazy-loader/lazy-loader.component';

@Component({
  selector: 'cenit-data-index-create',
  templateUrl: './index-create.component.html',
  styleUrls: ['./index-create.component.css']
})
export class IndexCreateComponent implements OnInit {

  @Input() indexContent: IndexContent;

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;
  dataType: DataType;

  ngOnInit() {
    this.indexContent.getDataType()
      .then(
        (dataType: DataType) => {
          this.dataType = dataType;
          this.lazyLoader.complete();
        }
      )
      .catch(error => this.lazyLoader.error(error));
  }
}
