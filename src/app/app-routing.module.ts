import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsmindComponent } from './jsmind/jsmind.component';
import { StartuppageComponent } from './startuppage/startuppage.component';

const routes: Routes = [
  { path: '', redirectTo: '/startuppage', pathMatch: 'full' },
  { path: 'startuppage', component: StartuppageComponent },
  {
    path: 'jsmind',
    component: JsmindComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
