import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from '../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanejamentoIntegradoInicialComponent } from './planejamento-integrado-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: PlanejamentoIntegradoInicialComponent,
    canActivate: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanejamentoIntegradoInicialRoutingModule { }
