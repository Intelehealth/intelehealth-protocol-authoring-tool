import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Providers
import { JsmindComponent } from './jsmind/jsmind.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddhealthdataComponent } from './addhealthdata/addhealthdata.component';
import { ModaldialogComponent } from './modaldialog/modaldialog.component';
import { ModaladdhealthdataComponent } from './modaladdhealthdata/modaladdhealthdata.component';
import { ModaledithealthdataComponent } from './modaledithealthdata/modaledithealthdata.component';
import { EdithealthdataComponent } from './edithealthdata/edithealthdata.component';
import { StartuppageComponent } from './startuppage/startuppage.component';

@NgModule({
  declarations: [
    AppComponent,
    JsmindComponent,
    AddhealthdataComponent,
    ModaldialogComponent,
    ModaladdhealthdataComponent,
    ModaledithealthdataComponent,
    EdithealthdataComponent,
    StartuppageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule {}
