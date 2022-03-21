import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelIndicadoresSubdivisaoComponent } from './painel-indicadores-subdivisao.component';
import { PainelIndicadoresSubdivisaoRoutingModule } from './painel-indicadores-subdivisao-routing.module';
import { MatAutocompleteModule, MatButtonModule, MatChipsModule, MatExpansionModule,MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ListaSubdivisoesComponent } from './lista-subdivisoes/lista-subdivisoes.component';
import { PaginaSubdivisaoComponent } from './pagina-subdivisao/pagina-subdivisao.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    PainelIndicadoresSubdivisaoRoutingModule,
    MatButtonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    ChartsModule,
    ScrollToModule.forRoot(),
    LeafletModule.forRoot()
  ],
  declarations: [PainelIndicadoresSubdivisaoComponent,ListaSubdivisoesComponent, PaginaSubdivisaoComponent]
})
export class PainelIndicadoresSubdivisaoModule { }
