import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';

@Component({
  selector: 'cenit-lazy-loader',
  templateUrl: './lazy-loader.component.html',
  styleUrls: ['./lazy-loader.component.css']
})
export class LazyLoaderComponent implements OnInit, OnDestroy, Observer<string> {

  @Input() passive: boolean;
  loading = true;
  errorDescription: string;
  @Input() status: string;
  @Input() type: string;
  @Input() loader: Observable<any>;
  @Input() lazy: Observer<any>;

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
    this.errorDescription = null;
    this.loading = true;
    this.load();
  }

  next(value: string) {
    this.status = value;
  }

  error(err: any) {
    this.loading = false;
    this.errorDescription = err.toString();
  }

  complete() {
    this.loading = false;
    this.status = 'Completed!';
  }
}
