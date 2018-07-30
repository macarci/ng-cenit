import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlTree} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  authCode: string;
  authState: string;
  access_token = 'checking';

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.authCode = this.route.snapshot.queryParams['code'];
    this.authState = this.route.snapshot.queryParams['state'];
    console.log(this.authCode);
    console.log(this.authState);
    if (this.authCode && this.authState === 'state') {
      this.httpClient.post(this.cenitAppURL('token'), this.authCode).subscribe(
        response => {
          console.log(response);
          this.access_token = response['access_token'];
        },
        error => {
          console.log('Error', error);
          this.access_token = 'failed';
        },
        () => {
          if (this.access_token === 'checking') {
            this.access_token = 'failed';
          }
        }
      );
    } else {
      this.access_token = 'to be requested...';
    }
  }

  autorize() {
    const url = this.authorizeUrl('state');
    window.location.replace(url);
  }

  authorizeUrl(state): string {
    return this.cenitAppURL('authorize', {
      redirect_uri: 'http://localhost:4200/authorize',
      state: state
    });
  }

  cenitAppURL(path, params?: Object): string {
    params = params || {};
    const urlTree = new UrlTree();
    urlTree.root = new UrlSegmentGroup([new UrlSegment(path, {})], {});
    urlTree.queryParams = params;
    // const identifier = '5b5cf77325d9850dfa01b3f86wnZvuGLtYMWKk_a_McbybhrskJdwZFiCga2uzz2pqiojzqgcGTuerRY42hz';
    const identifier = '5b5dafbfce50762c01000008CSPNShUFhvpEXiF3G3gC8dMSYVuycaqJ1o3Dp3ymnMnh-ZpCJwYEQdnFAnuM';
    return 'http://localhost:3000/app/' + identifier + new DefaultUrlSerializer().serialize(urlTree);
  }
}
