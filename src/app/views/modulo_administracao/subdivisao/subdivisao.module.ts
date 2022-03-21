import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubdivisaoRoutingModule } from './subdivisao-routing.module';
import { TipoSubdivisaoComponent } from './tipo-subdivisao/tipo-subdivisao.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDividerModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaSubdivisaoComponent } from './lista-subdivisao/lista-subdivisao.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

@NgModule({
  declarations: [TipoSubdivisaoComponent, ListaSubdivisaoComponent ],
  imports: [
    CommonModule,
    SubdivisaoRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    MatProgressSpinnerModule
  ]
})
export class SubdivisaoModule { }
