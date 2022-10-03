import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './routes/form/form.component';
import { NotfoundComponent } from './routes/notfound/notfound.component';
import { ResultsComponent } from './routes/results/results.component';

const routes: Routes = [
  {
    path: 'form',
    component: FormComponent
  },
  {

    path: 'results',
    component: ResultsComponent
  },
  {
    path: '',
    component: FormComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
