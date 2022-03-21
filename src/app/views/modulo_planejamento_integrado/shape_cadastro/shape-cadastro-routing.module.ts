import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from '../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShapeCadastroListComponent } from './shape-cadastro-list/shape-cadastro-list.component';
import { ShapeCadastroFormComponent } from './shape-cadastro-form/shape-cadastro-form.component';
import { ShapeFilesDetalheVisualizarComponent } from './shape-detalhe/shapefiles-detalhe-visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: ShapeCadastroListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_SHAPEFILE_RASTER'}
  },
  {
    path: 'cadastrar',
    component: ShapeCadastroFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_SHAPEFILE_RASTER', title: 'Cadastrar'}
  },
  {
    path: 'detalhes/:id',
    component: ShapeFilesDetalheVisualizarComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_SHAPEFILE_RASTER', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: ShapeCadastroFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_SHAPEFILE_RASTER', title: 'Cadastrar'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShapeCadastroRoutingModule { }
