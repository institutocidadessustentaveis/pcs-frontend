import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosPrincipalRoutingModule } from './eventos-principal-routing.module';
import { EventosPrincipalComponent } from './eventos-principal.component';
import { MapaEventosModule } from '../mapa-eventos/mapa-eventos.module';
import { CardEventoModule } from '../card-evento/card-evento.module';
import { EventosCalendarioModule } from '../eventos-calendario/eventos-calendario.module';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

@NgModule({
  declarations: [EventosPrincipalComponent],
  imports: [
    EventosCalendarioModule,
    CommonModule,
    CardEventoModule,
    MapaEventosModule,
    EventosPrincipalRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    DatepickerPCSModule,
    ShareModule,
    AngularFontAwesomeModule,
    JwSocialButtonsModule
  ]
})
export class EventosPrincipalModule { }
