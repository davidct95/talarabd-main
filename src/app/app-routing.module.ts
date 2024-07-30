import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'talara',
    loadChildren: () => import('./infobd/infobd.module').then(m => m.InfobdModule)
  },
  {
    path: '',
    redirectTo: 'talara',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'talara'
  }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [
      RouterModule
    ]
})
export class AppRoutingModule{}
