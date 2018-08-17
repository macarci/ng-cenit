import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataType} from '../../services/data-type.service';
import {IndexContent} from '../../containers/data-container/data-container.component';
import {LazyLoaderComponent} from '../lazy-loader/lazy-loader.component';
import {AuthService} from '../../services/auth.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {of, Subscription} from 'rxjs';
import {HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';

@Component({
  selector: 'cenit-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class FileUploadFormComponent implements OnInit {

  @Input() dataType: DataType;
  @Input() indexContent: IndexContent;

  uploadUrl: string;
  headers: { [name: string]: string | string[]; };

  @ViewChild(LazyLoaderComponent) lazyLoader: LazyLoaderComponent;
  @ViewChild('fileUpload') fileUploadRef: ElementRef<HTMLInputElement>;

  @Output() complete = new EventEmitter<string>();

  fileUploads: Array<FileUpload> = [];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAccessToken()
      .then(
        (access_token: string) => {
          this.uploadUrl = this.dataType.apiService.apiURL(['setup', 'data_type', this.dataType.id, 'digest']);
          this.headers = {Authorization: 'Bearer ' + access_token};
          this.lazyLoader.complete();
        }
      )
      .catch(error => this.lazyLoader.error(error));
  }

  filesPicker() {
    this.fileUploadRef.nativeElement.click();
  }

  filesPicked() {
    for (let index = 0; index < this.fileUploadRef.nativeElement.files.length; index++) {
      const file = this.fileUploadRef.nativeElement.files[index];
      this.fileUploads.push({
        file: file,
        state: 'in',
        uploading: false,
        progress: 0,
        canRetry: false,
        canCancel: true
      });
    }
    this.uploadFiles();
  }

  cancel(fileUpload: FileUpload) {
    fileUpload.subscription.unsubscribe();
    this.remove(fileUpload);
  }

  retry(fileUpload: FileUpload) {
    this.upload(fileUpload);
    fileUpload.canRetry = false;
  }

  private upload(fileUpload: FileUpload) {
    const httpReq = new HttpRequest('POST', this.uploadUrl, fileUpload.file, {
      headers: new HttpHeaders({
        ...this.headers,
        'X-Digest-Options': JSON.stringify({filename: fileUpload.file.name})
      }),
      reportProgress: true
    });

    fileUpload.uploading = true;
    fileUpload.subscription = this.dataType.apiService.httpClient.request(httpReq).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            fileUpload.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => {
      }),
      last(),
      catchError((error: HttpErrorResponse) => {
        fileUpload.uploading = false;
        fileUpload.canRetry = true;
        return of(`${fileUpload.file.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.remove(fileUpload);
          this.complete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles() {
    this.fileUploadRef.nativeElement.value = '';
    this.fileUploads.forEach(fileUpload => {
      this.upload(fileUpload);
    });
  }

  private remove(file: FileUpload) {
    const index = this.fileUploads.indexOf(file);
    if (index > -1) {
      this.fileUploads.splice(index, 1);
    }
  }

}

export class FileUpload {
  file: File;
  state: string;
  uploading: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  subscription?: Subscription;
}
