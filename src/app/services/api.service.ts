import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

@Injectable()
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService) {
  }

  get<T>(params: string[], query?: { [param: string]: string | string[] }, viewport?: string): Observable<T> {
    return new Observable<T>((subscriber: Observer<T>) => {
      this.authService.getAccessToken().then(
        access_token => {
          const options = {
            headers: {
              Authorization: 'Bearer ' + access_token
            },
            params: query
          };
          if (viewport) {
            options.headers['X-Render-Options'] = {viewport: viewport};
          }
          this.httpClient.get(this.apiURL(params), options).subscribe(
            (response: T) => {
              subscriber.next(response);
            },
            error => {
              subscriber.error(error);
            },
            () => subscriber.complete()
          );
        }).catch(error => subscriber.error(error));
    });
  }

  post(params: string[], body: any, query?: { [param: string]: string | string[] }): Observable<Object> {
    return new Observable<Object>(subscriber => {
      this.authService.getAccessToken().then(
        access_token => {
          this.httpClient.post(this.apiURL(params), body, {
            headers: {
              Authorization: 'Bearer ' + access_token
            },
            params: query
          }).subscribe(
            response => {
              subscriber.next(response);
            },
            error => {
              subscriber.error(error);
            },
            () => subscriber.complete()
          );
        }).catch(error => subscriber.error(error));
    });
  }

  digest(params: string[], body: any = '', query?: { [param: string]: string | string[] }): Observable<Object> {
    return this.post([...params, 'digest'], body, query);
  }

  apiURL(params: string[]) {
    return environment.cenitHost + '/api/v3/' + params.join('/');
  }
}
