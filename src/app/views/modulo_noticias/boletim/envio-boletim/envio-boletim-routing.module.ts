import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnvioBoletimComponent } from './envio-boletim.component';

const routes: Routes = [
  {
    path: '',
    component: EnvioBoletimComponent,
    data: {title: 'Notícias » Administracao de Boletins'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvioBoletimRoutingModule { }
