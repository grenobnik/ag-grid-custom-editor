import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AgGridModule} from 'ag-grid-angular';
import {ActionsMenuComponent} from './actions-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {InputEditorComponent} from './input-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ActionsMenuComponent,
    InputEditorComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([
      ActionsMenuComponent,
      InputEditorComponent,
    ]),
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
