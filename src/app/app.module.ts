import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule, MatMenuModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {MainNavigationComponent} from './navigation/main-navigation/main-navigation.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthorizeComponent} from './authorize/authorize.component';
import {RouterModule, Routes} from '@angular/router';
import {MainContainerComponent} from './containers/main-navigation/main-container.component';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './services/auth-guard.service';

const appRoutes: Routes = [
  {path: 'authorize', component: AuthorizeComponent},
  {path: '', component: MainContainerComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent,
    AuthorizeComponent,
    MainContainerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule
  ],
  providers: [AuthService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
