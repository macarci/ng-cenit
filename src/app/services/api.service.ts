import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

@Injectable()
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService) {
  }

  get(params: string[], query?: { [param: string]: string | string[] }): Observable<Object> {
    return new Observable<Object>(subscriber => {
      this.authService.getAccessToken().subscribe(
        access_token => {
          console.log('Requesting API...');
          this.httpClient.get(this.apiURL(params), {
            headers: {
              Authorization: 'Bearer ' + access_token
            },
            params: query
          }).subscribe(
            response => {
              console.log('Receiving API response...', response);
              subscriber.next(response);
            },
            error => {
              console.log('API response with error...');
              subscriber.error(error);
            },
            () => subscriber.complete()
          );
        },
        error => subscriber.error(error)
      );
    });
  }

  post(params: string[], body: any, query?: { [param: string]: string | string[] }): Observable<Object> {
    return new Observable<Object>(subscriber => {
      this.authService.getAccessToken().subscribe(
        access_token => {
          console.log('Performing POST API...', body);
          this.httpClient.post(this.apiURL(params), body, {
            headers: {
              Authorization: 'Bearer ' + access_token
            },
            params: query
          }).subscribe(
            response => {
              console.log('Receiving POST API response...', response);
              subscriber.next(response);
            },
            error => {
              console.log('POST API response with error...');
              subscriber.error(error);
            },
            () => subscriber.complete()
          );
        },
        error => subscriber.error(error)
      );
    });
  }

  apiURL(params: string[]) {
    return environment.cenitHost + '/api/v3/' + params.join('/');
  }
}
