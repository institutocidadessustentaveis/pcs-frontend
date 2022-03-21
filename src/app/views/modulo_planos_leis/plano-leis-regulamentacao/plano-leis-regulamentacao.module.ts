import { NgxSummernoteModule } from 'ngx-summernote';
import { TempoPercorridoModule } from './../../../components/tempo-percorrido/tempo-percorrido.module';
import { ItemMaterialApoioModule } from './../../modulo_participacao_cidada/item-material-apoio/item-material-apoio.module';
import { ShareModule } from '@ngx-share/core';
import { DatepickerPCSModule } from './../../../components/datepicker/datepickerpcs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatProgressBarModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { PlanoLeisRegulamentacaoComponent } from './plano-leis-regulamentacao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PlanoLeisRegulamentacaoRoutingModule } from './plano-leis-regulamentacao-routing.module';

@NgModule({
  declarations: [PlanoLeisRegulamentacaoComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    PlanoLeisRegulamentacaoRoutingModule,
    MatProgressSpinnerModule,
    BreadcrumbModule,
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
    ItemMaterialApoioModule,
    TempoPercorridoModule,
    NgxSummernoteModule,
    LeafletModule.forRoot(),
  ],
  exports: [
    PlanoLeisRegulamentacaoComponent
  ]
})
export class PlanoLeisRegulamentacaoModule { }
