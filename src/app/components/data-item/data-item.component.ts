import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataType} from '../../services/data-type.service';
import {ItemContent} from '../../containers/data-container/data-container.component';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {ReactiveFormComponent} from '../reactive-form/reactive-form.component';

@Component({
  selector: 'cenit-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.css']
})
export class DataItemComponent implements OnInit {

  @Output() deleted = new EventEmitter<void>();

  @ViewChild(ReactiveFormComponent) reactiveForm: ReactiveFormComponent;
  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  @Input() itemContent: ItemContent;
  dataType: DataType;
  data: Object;

  constructor() {
  }

  ngOnInit() {
    this.lazyLoader.loading = this.lazyLoader.opened = false;
    this.itemContent.getDataType()
      .then(
        (dataType: DataType) => {
          this.dataType = dataType;
          dataType.apiService.get(this.itemContent.getApiParams())
            .subscribe(
              response => {
                this.data = response;
                this.lazyLoader.complete();
              },
              error => this.lazyLoader.error(error)
            );
        }
      )
      .catch(error => this.lazyLoader.error(error));
  }

  update() {
    this.lazyLoader.reload();
    this.lazyLoader.next('Updating...');
    this.dataType.apiService.post(this.itemContent.getApiParams(), this.reactiveForm.getData())
      .subscribe(
        response => {
          console.log(response);
          this.lazyLoader.complete();
        },
        error => {
          this.lazyLoader.error(error);
        }
      );
  }

  delete() {
    if (confirm('Confirm delete?')) {
      this.lazyLoader.reload();
      this.lazyLoader.next('Deleting...');
      this.dataType.apiService.delete(this.itemContent.getApiParams())
        .subscribe(
          response => {
            this.deleted.emit();
          },
          error => {
            this.lazyLoader.error(error);
          }
        );
    }
  }
}
