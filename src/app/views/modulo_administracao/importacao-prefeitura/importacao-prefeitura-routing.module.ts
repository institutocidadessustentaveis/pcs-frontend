import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportacaoPrefeituraComponent } from './importacao-prefeitura.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ImportacaoPrefeituraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportacaoPrefeituraRoutingModule { }
