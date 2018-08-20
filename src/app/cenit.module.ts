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
  MatPaginatorModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatSelectModule,
  MatChipsModule
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataContainerComponent} from './containers/data-container/data-container.component';
import {DataDashboardComponent} from './components/data-dashboard/data-dashboard.component';
import {DataIndexComponent} from './components/data-index/data-index.component';
import {DataTypeService} from './services/data-type.service';
import {DataItemComponent} from './components/data-item/data-item.component';
import {IndexListComponent} from './components/data-index/list/index-list.component';
import {IndexCreateComponent} from './components/data-index/create/index-create.component';
import {ReactiveFormComponent} from './components/reactive-form/reactive-form.component';
import {ReactiveFormGroupComponent} from './components/reactive-form/reactive-form-group/reactive-form-group.component';
import {ReactiveFormArrayComponent} from './components/reactive-form/reactive-form-array/reactive-form-array.component';
import {ReactiveFieldComponent} from './components/reactive-form/reactive-field/reactive-field.component';
import {ReactiveArrayItemComponent} from './components/reactive-form/reactive-form-array/reactive-array-item/reactive-array-item.component';
import {InputControlComponent} from './components/reactive-form/reactive-field/input-control/input-control.component';
import {EnumControlComponent} from './components/reactive-form/reactive-field/enum-control/enum-control.component';
import {BooleanControlComponent} from './components/reactive-form/reactive-field/boolean-control/boolean-control.component';
import {FileUploadFormComponent} from './components/file-upload-form/file-upload-form.component';
import {ReactiveFormRefOneComponent} from './components/reactive-form/reactive-form-ref/reactive-form-ref-one/reactive-form-ref-one.component';
import {ReactiveFormRefManyComponent} from './components/reactive-form/reactive-form-ref/reactive-form-ref-many/reactive-form-ref-many.component';
import {ReactiveArrayItemRefComponent} from './components/reactive-form/reactive-form-ref/reactive-form-ref-many/reactive-array-item-ref/reactive-array-item-ref.component';

const appRoutes: Routes = [
  {path: 'authorize', component: AuthorizeComponent},
  {
    path: '', component: MainContainerComponent, canActivate: [AuthGuardService], children: [
      {path: '**', component: DataContainerComponent}
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
    DataIndexComponent,
    IndexListComponent,
    IndexCreateComponent,
    DataItemComponent,
    ReactiveFormComponent,
    ReactiveFormGroupComponent,
    ReactiveFormArrayComponent,
    ReactiveFieldComponent,
    ReactiveArrayItemComponent,
    InputControlComponent,
    EnumControlComponent,
    BooleanControlComponent,
    FileUploadFormComponent,
    ReactiveFormRefOneComponent,
    ReactiveFormRefManyComponent,
    ReactiveArrayItemRefComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatGridListModule,
    MatChipsModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ApiService,
    DataTypeService
  ],
  bootstrap: [CenitComponent]
})
export class CenitModule {
}
