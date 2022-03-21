import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipacaoCidadaPrincipalComponent } from './participacao-cidada-principal.component';
import { ParticipacaoCidadaPrincipalRoutingModule } from './participacao-cidada-principal-routing.module';
import { EventosCalendarioModule } from '../../modulo_eventos/eventos-calendario/eventos-calendario.module';
import { MapaEventosModule } from '../../modulo_eventos/mapa-eventos/mapa-eventos.module';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatButtonModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [ParticipacaoCidadaPrincipalComponent],
  imports: [
    CommonModule,
    ParticipacaoCidadaPrincipalRoutingModule,
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
    NgxSummernoteModule,
  ]
})
export class ParticipacaoCidadaPrincipalModule { }
