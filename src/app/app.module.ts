import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './routes/form/form.component';
import { ResultsComponent } from './routes/results/results.component';
import { NotfoundComponent } from './routes/notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResultsComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
