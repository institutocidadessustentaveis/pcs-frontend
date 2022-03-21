import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule  } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BoasPraticasInicialRoutingModule } from './boas-praticas-inicial-routing.module';
import { BoasPraticasInicialComponent } from './boas-praticas-inicial.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BoasPraticasInicialHeaderModule } from './boas-praticas-inicial-header/boas-praticas-inicial-header.module';
import { BoasPraticasInicialSecoesModule } from './boas-praticas-inicial-secoes/boas-praticas-inicial-secoes.module';


@NgModule({
  declarations: [BoasPraticasInicialComponent],
  imports: [
    CommonModule,
    BoasPraticasInicialRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    NgxMaskModule.forRoot(),
    ScrollToModule.forRoot(),
    LeafletModule.forRoot(),
    MatProgressSpinnerModule,
    BreadcrumbModule,
    MatAutocompleteModule,
    BoasPraticasInicialHeaderModule,
    BoasPraticasInicialSecoesModule
  ]
})
export class BoasPraticasInicialModule { }
