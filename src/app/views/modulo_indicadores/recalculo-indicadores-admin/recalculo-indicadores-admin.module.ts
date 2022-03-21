import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecalculoIndicadoresAdminComponent } from './recalculo-indicadores-admin.component';
import { RecalculoIndicadoresAdminRoutingModule } from './recalculo-indicadores-admin-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecalculoIndicadoresAdminComponent],
  imports: [
    CommonModule,
    RecalculoIndicadoresAdminRoutingModule,
    FormsModule,
  ]
})
export class RecalculoIndicadoresAdminModule { }
