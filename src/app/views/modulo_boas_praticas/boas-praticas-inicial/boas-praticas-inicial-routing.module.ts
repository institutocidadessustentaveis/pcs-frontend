import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from '../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoasPraticasInicialComponent } from './boas-praticas-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: BoasPraticasInicialComponent,
    canActivate: []
  },
  {
    path: 'detalhes/:id',
    component: BoasPraticasInicialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoasPraticasInicialRoutingModule { }
