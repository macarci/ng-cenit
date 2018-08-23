import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

export interface RequestOptions {
  headers?: Object;
  query?: Object;
  template?: Object;
}

@Injectable()
export class ApiService {

  constructor(
    readonly httpClient: HttpClient,
    readonly authService: AuthService) {
  }

  get<T>(params: string[], options?: RequestOptions): Observable<T> {
    options = options || {};
    return new Observable<T>((subscriber: Observer<T>) => {
      this.httpRequestOptionsFrom(options)
        .then(
          reqOptions => {
            this.httpClient.get(this.apiURL(params), reqOptions)
              .subscribe(
                (response: T) => {
                  subscriber.next(response);
                },
                error => {
                  subscriber.error(error);
                },
                () => subscriber.complete()
              );
          })
        .catch(error => subscriber.error(error));
    });
  }

  post(params: string[], body: any, options?: RequestOptions): Observable<Object> {
    return new Observable<Object>(subscriber => {
      this.httpRequestOptionsFrom(options)
        .then(
          reqOptions => {
            this.httpClient.post(this.apiURL(params), body, reqOptions)
              .subscribe(
                response => {
                  subscriber.next(response);
                },
                error => {
                  subscriber.error(error);
                },
                () => subscriber.complete()
              );
          })
        .catch(error => subscriber.error(error));
    });
  }

  apiURL(params: string[]) {
    return environment.cenitHost + '/api/v3/' + params.join('/');
  }

  httpRequestOptionsFrom(options: RequestOptions): Promise<Object> {
    return new Promise<Object>(
      (resolve, reject) => {
        options = options || {};
        this.authService.getAccessToken().then(
          access_token => {
            const reqOptions = {
              headers: {
                Authorization: 'Bearer ' + access_token
              }
            };
            if (options.query) {
              reqOptions['params'] = options.query;
            }
            const templateOptions = options.template || {};
            if (!templateOptions.hasOwnProperty('raw_properties')) {
              templateOptions['raw_properties'] = true;
            }
            reqOptions.headers['X-Template-Options'] = JSON.stringify(templateOptions);
            resolve(reqOptions);
          }
        ).catch(error => reject(error));
      }
    );
  }
}
