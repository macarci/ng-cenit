import {Component, Input, OnInit} from '@angular/core';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'cenit-lazy-loader',
  templateUrl: './lazy-loader.component.html',
  styleUrls: ['./lazy-loader.component.css']
})
export class LazyLoaderComponent implements OnInit {

  loading = true;
  error: string;

  @Input() loader: Observable<any>;
  @Input() lazy: Observer<any>;

  ngOnInit() {
    this.load();
  }

  load() {
    console.log('Lazy loading...');
    if (this.loader) {
      console.log('Subscribing loader...');
      this.loader.subscribe(
        value => {
          if (this.lazy) {
            console.log('Notifying lazy...');
            this.lazy.next(value);
          }
        },
        error => {
          console.log('Stop loading on error:', error);
          this.loading = false;
          this.error = error.toString();
          if (this.lazy) {
            this.lazy.error(error);
          }
        },
        () => {
          console.log('Stop loading. Complete!');
          this.loading = false;
          if (this.lazy) {
            this.lazy.complete();
          }
        }
      );
    }
  }

  reload() {
    this.loading = true;
    this.load();
  }
}
