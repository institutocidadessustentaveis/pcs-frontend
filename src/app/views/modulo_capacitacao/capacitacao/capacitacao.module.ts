import { CapacitacaoRoutingModule } from './capacitacao-routing.module';
import { CapacitacaoComponent } from './capacitacao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosCalendarioModule } from '../../modulo_eventos/eventos-calendario/eventos-calendario.module';
import { MapaEventosModule } from '../../modulo_eventos/mapa-eventos/mapa-eventos.module';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatButtonModule, MatInputModule, MatSelectModule, MatTooltipModule, MatAutocompleteModule, MatRadioModule } from '@angular/material';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';


@NgModule({
  declarations: [CapacitacaoComponent],
  imports: [
    CommonModule,
    CapacitacaoRoutingModule,
    EventosCalendarioModule,
    MapaEventosModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    DatepickerPCSModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatRadioModule,
    DadosDownloadModule
  ]
})
export class CapacitacaoModule { }
