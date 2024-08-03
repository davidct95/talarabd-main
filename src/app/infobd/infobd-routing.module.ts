import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { BtnPaquetesComponent } from './components/btn-paquetes/btn-paquetes.component';

const routes: Routes = [
  {
    path: 'talara',
    component: HomeComponent,
    children: [
      {
        path: ':sector',
        component: BtnPaquetesComponent,
      }
    ]
  },
  {
    path: 'pq/:paqueteId',
    component: PrincipalComponent
  },
  {
    path: '**',
    redirectTo: 'talara'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class InfobdRoutingModule { }
