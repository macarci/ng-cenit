import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';

@Component({
  selector: 'cenit-lazy-loader',
  templateUrl: './lazy-loader.component.html',
  styleUrls: ['./lazy-loader.component.css']
})
export class LazyLoaderComponent implements OnInit, OnDestroy, Observer<string> {

  @Input() passive: boolean;
  @Input() loading = true;
  @Input() status: string;
  @Input() type: string;
  @Input() loader: Observable<any>;
  @Input() lazy: Observer<any>;

  failed: boolean;
  subscription: Subscription;

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.unsubscribe();
    if (this.loader) {
      this.subscription = this.loader.subscribe(
        value => {
          if (this.lazy) {
            this.lazy.next(value);
          }
        },
        error => {
          this.error(error);
          if (this.lazy && this.lazy !== this) {
            this.lazy.error(error);
          }
        },
        () => {
          this.complete();
          if (this.lazy && this.lazy !== this) {
            this.lazy.complete();
          }
        }
      );
    }
  }

  reload() {
    this.failed = false;
    this.loading = true;
    this.load();
  }

  next(value: string) {
    this.status = value;
  }

  error(err: any) {
    this.failed = true;
    this.status = err.toString();
  }

  complete() {
    this.failed = false;
    this.loading = false;
    this.status = 'Completed!';
  }

  clicked() {
    if (this.loading && this.failed) {
      this.loading = false;
    }
  }
}
