import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const ACCESS_TOKEN_KEY = 'access_token';
const ID_TOKEN_KEY = 'id_token';
const EXPIRATION_DATE_KEY = 'expiration_date';

@Injectable()
export class AuthService {

  idToken: Object;

  constructor(private httpClient: HttpClient) {
  }

  getIdToken(): Object {
    if (!this.idToken) {
      this.idToken = this.parseJwt(localStorage.getItem(ID_TOKEN_KEY));
    }
    return this.idToken;
  }

  storeAccessTokenInfo(accessTokenInfo) {
    console.log('Storing access token...', accessTokenInfo);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessTokenInfo[ACCESS_TOKEN_KEY]);
    localStorage.setItem(EXPIRATION_DATE_KEY, accessTokenInfo[EXPIRATION_DATE_KEY]);
    localStorage.setItem(ID_TOKEN_KEY, accessTokenInfo[ID_TOKEN_KEY]);
    this.idToken = null;
    this.parseJwt(accessTokenInfo[ID_TOKEN_KEY]);
  }

  getAccessToken(): Observable<string> {
    console.log('Resolving access token...');
    return new Observable<string>(subscriber => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const expirationDate = new Date(localStorage.getItem(EXPIRATION_DATE_KEY));
      if (accessToken && expirationDate) {
        if (expirationDate < new Date()) {
          console.log('Requesting new access token...');
          this.httpClient.post(this.cenitAppURL('token'), accessToken).subscribe(
            response => {
              this.storeAccessTokenInfo(response);
              subscriber.next(response[ACCESS_TOKEN_KEY]);
            },
            error => {
              subscriber.error(error);
            },
            () => {
              subscriber.complete();
            }
          );
        } else {
          console.log('Using current access token...');
          subscriber.next(accessToken);
          subscriber.complete();
        }
      } else {
        console.log('No access token yet...');
        subscriber.error('Not authorized');
      }
    });
  }

  checkAuthState(options?: Object): Observable<Object> {
    const code = options && options['code'];
    const state = options && options['state'];
    return new Observable(subscriber => {
      if (code && this.isValidAuthState(state)) {
        console.log('Retrieving access token...');
        this.httpClient.post(this.cenitAppURL('token'), code).subscribe(
          response => {
            console.log(response);
            this.storeAccessTokenInfo(response);
          },
          error => {
            console.log('Error', error);
            subscriber.error(error);
          },
          () => {
            console.log('Auth checking completed!');
            subscriber.complete();
          }
        );
      } else {
        this.getAccessToken().subscribe(
          null,
          error => {
            subscriber.error(error);
          },
          () => {
            subscriber.complete();
          }
        );
      }
    });
  }

  isValidAuthState(state): boolean {
    return state === 'state';
  }

  isAuthenticated(): boolean {
    const authed = (localStorage.getItem(ACCESS_TOKEN_KEY) &&
      localStorage.getItem(EXPIRATION_DATE_KEY)) != null;
    console.log('AUTHED', authed);
    return authed;
  }

  parseJwt(token) {
    const base64 = token.split('.')[1].replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64);
  }

  getSignOutURL() {
    return environment.cenitHost + '/users/sign_out';
  }

  authorize() {
    const url = this.authorizeUrl('state');
    window.location.replace(url);
  }

  signOut() {
    localStorage.clear();
    window.location.replace(this.getSignOutURL());
  }

  authorizeUrl(state): string {
    return this.cenitAppURL('authorize', {
      redirect_uri: environment.localHost + '/authorize',
      state: state
    });
  }

  cenitAppURL(path, params?: Object): string {
    params = params || {};
    const urlTree = new UrlTree();
    urlTree.root = new UrlSegmentGroup([new UrlSegment(path, {})], {});
    urlTree.queryParams = params;
    return environment.cenitHost + '/app/ng-cenit' + new DefaultUrlSerializer().serialize(urlTree);
  }
}
