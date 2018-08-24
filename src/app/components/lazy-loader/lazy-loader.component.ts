import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';

@Component({
  selector: 'cenit-lazy-loader',
  templateUrl: './lazy-loader.component.html',
  styleUrls: ['./lazy-loader.component.css']
})
export class LazyLoaderComponent implements OnInit, OnDestroy, Observer<string> {

  @Input() closeOnComplete = true;
  @Input() opened = true;
  @Input() passive: boolean;
  @Input() loading = true;
  @Input() status: string;
  @Input() type: string;
  @Input() loader: Observable<any>;
  @Input() lazy: Observer<any>;
  @Input() frozen: boolean;

  failed: boolean;
  completed: boolean;
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
    this.failed = this.completed = false;
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
    this.opened = !this.closeOnComplete;
    this.completed = true;
    this.status = 'Completed!';
  }

  close() {
    this.opened = false;
  }

  clicked() {
    if ((this.loading || this.opened) && (this.failed || this.completed) && !this.frozen) {
      this.loading = false;
      this.close();
    }
  }
}
