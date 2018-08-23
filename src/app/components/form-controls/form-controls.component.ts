import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataType} from '../../services/data-type.service';
import {ReactiveFormComponent} from '../reactive-form/reactive-form.component';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';


@Component({
  selector: 'cenit-form-controls',
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.css']
})
export class FormControlsComponent implements OnInit {

  @ViewChild(ReactiveFormComponent) reactiveForm: ReactiveFormComponent;
  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  @Input() dataType: DataType;

  ngOnInit() {
    this.lazyLoader.loading = false;
  }

  submit() {
    this.lazyLoader.loading = true;
    this.lazyLoader.next('Submitting...');
    this.dataType.createFrom(this.reactiveForm.getData())
      .subscribe(
        response => {
          console.log(response);
          this.lazyLoader.complete();
        },
        error => this.lazyLoader.error(error)
      )
    ;
  }
}
