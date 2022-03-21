import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import localePt from '@angular/common/locales/pt';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSortModule,
  MatExpansionModule,
  MatTooltipModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageViewerModule } from 'ng2-image-viewer';

import { AprovacaoPrefeituraRoutingModule } from './aprovacao-prefeitura-routing.module';
import { AprovacaoPrefeituraComponent, DialogModalReenvioEmail } from './aprovacao-prefeitura.component';
import { JustificativaReprovacaoDialog, DetalhamentoPedidoAprovacaoComponent } from '../pedido-aprovacao-detalhamento/detalhamento-pedido-aprovacao.component';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { NgxMaskModule } from 'ngx-mask';

registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [AprovacaoPrefeituraComponent, JustificativaReprovacaoDialog,  DialogModalReenvioEmail,
     DetalhamentoPedidoAprovacaoComponent],
  imports: [
    CommonModule,
    AprovacaoPrefeituraRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    ImageViewerModule,
    DatepickerPCSModule,
    MatSortModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),
  ],
  entryComponents: [JustificativaReprovacaoDialog,  DialogModalReenvioEmail, DetalhamentoPedidoAprovacaoComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class AprovacaoPrefeituraModule { }
