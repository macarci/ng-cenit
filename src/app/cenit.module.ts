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

import {CenitComponent} from './cenit.component';
import {MainNavigationComponent} from './navigation/main-navigation/main-navigation.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthorizeComponent} from './authorize/authorize.component';
import {RouterModule, Routes} from '@angular/router';
import {MainContainerComponent} from './containers/main-container/main-container.component';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './services/auth-guard.service';
import {ToolbarComponent} from './navigation/toolbar/toolbar.component';

const appRoutes: Routes = [
  {path: 'authorize', component: AuthorizeComponent},
  {path: '', component: MainContainerComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  declarations: [
    CenitComponent,
    MainNavigationComponent,
    AuthorizeComponent,
    MainContainerComponent,
    ToolbarComponent
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
  bootstrap: [CenitComponent]
})
export class CenitModule {
}
