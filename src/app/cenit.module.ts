import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';

import {CenitComponent} from './cenit.component';
import {MainNavigationComponent} from './navigation/main-navigation/main-navigation.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthorizeComponent} from './components/authorize/authorize.component';
import {RouterModule, Routes} from '@angular/router';
import {MainContainerComponent} from './containers/main-container/main-container.component';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './services/auth-guard.service';
import {ToolbarComponent} from './navigation/toolbar/toolbar.component';
import {UserLinkComponent} from './navigation/toolbar/user-link/user-link.component';
import {TenantSelectorComponent} from './navigation/toolbar/tenant-selector/tenant-selector.component';
import {LazyLoaderComponent} from './components/lazy-loader/lazy-loader.component';
import {ApiService} from './services/api.service';
import {FormsModule} from '@angular/forms';
import {DataContainerComponent} from './containers/data-container/data-container.component';
import {DataDashboardComponent} from './components/data-dashboard/data-dashboard.component';
import {DataIndexComponent} from './components/data-index/data-index.component';

const appRoutes: Routes = [
  {path: 'authorize', component: AuthorizeComponent},
  {
    path: '', component: MainContainerComponent, canActivate: [AuthGuardService], children: [
      {path: 'dashboard', component: DataContainerComponent},
      {path: ':ns/:model', component: DataContainerComponent},
      {path: ':ns/:model/:id', component: DataContainerComponent}
    ]
  }
];

@NgModule({
  declarations: [
    CenitComponent,
    MainNavigationComponent,
    AuthorizeComponent,
    MainContainerComponent,
    ToolbarComponent,
    UserLinkComponent,
    TenantSelectorComponent,
    LazyLoaderComponent,
    DataContainerComponent,
    DataDashboardComponent,
    DataIndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
    MatMenuModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [AuthService, AuthGuardService, ApiService],
  bootstrap: [CenitComponent]
})
export class CenitModule {
}
