import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataType} from '../../services/data-type.service';
import {ReactiveFormComponent} from '../reactive-form/reactive-form.component';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {ModelContent} from '../../containers/data-container/data-container.component';


@Component({
  selector: 'cenit-form-controls',
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.css']
})
export class FormControlsComponent implements OnInit {

  @ViewChild(ReactiveFormComponent) reactiveForm: ReactiveFormComponent;
  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  @Input() modelContent: ModelContent;
  @Input() dataType: DataType;
  @Input() data;

  createdPath: string;

  ngOnInit() {
    this.lazyLoader.loading = this.lazyLoader.opened = false;
  }

  submit() {
    this.createdPath = null;
    this.lazyLoader.loading = true;
    this.lazyLoader.next('Submitting...');
    this.dataType.createFrom(this.reactiveForm.getData())
      .subscribe(
        response => {
          this.reactiveForm.setData({});
          this.createdPath = '/' + this.modelContent.model + '/' + response['_id'];
          this.lazyLoader.complete();
        },
        error => {
          this.lazyLoader.error(error);
        }
      )
    ;
  }
}
