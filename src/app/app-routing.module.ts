import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacionComponent } from './autenticacion/autenticacion/autenticacion.component';
import { PaginasComponent } from './layout/paginas.component';

const routes: Routes = [
  { path:'', component: AutenticacionComponent},
  { path:'dashboard',component: PaginasComponent,
    children: [
      { path: 'usuario',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
