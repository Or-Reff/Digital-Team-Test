import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxModule } from "./modules/box/box.module";
import { BoxServiceComponent } from './services/box-service/box-service.component';

@NgModule({
    declarations: [
        AppComponent,
        BoxServiceComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BoxModule
    ]
})
export class AppModule { }
