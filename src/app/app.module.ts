import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatExpansionModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';

import { AppComponent } from './app.component';
import {MainNavigationComponent} from './navigation/main-navigation/main-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
