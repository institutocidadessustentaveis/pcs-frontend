import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaDadosDownloadComponent } from './lista-dados-download.component';

const routes: Routes = [
  {
    path:'',
    component: ListaDadosDownloadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaDadosDownloadRoutingModule { }
