import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {DataType, DataTypeService} from '../../services/data-type.service';
import {IndexContent, ItemContent} from '../../containers/data-container/data-container.component';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'cenit-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css']
})
export class FileUploadFormComponent implements OnInit {

  @Input() dataType: DataType;
  @Input() indexContent: IndexContent;

  uploadUrl: string;
  headers: { [header: string]: string | string[] };
  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAccessToken()
      .then(
        (access_token: string) => {
          this.uploadUrl = this.dataType.apiService.apiURL(this.indexContent.getApiParams());
          this.headers = {Authorization: 'Bearer ' + access_token};
          this.lazyLoader.complete();
        }
      )
      .catch(error => this.lazyLoader.error(error));
  }

}
