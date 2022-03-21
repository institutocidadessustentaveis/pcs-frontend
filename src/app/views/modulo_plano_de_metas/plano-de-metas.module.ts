import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanoDeMetasRoutingModule } from './plano-de-metas-routing.module';
import { PlanoDeMetasCidadeComponent } from './plano-de-metas-cidade/plano-de-metas-cidade.component';
import { PlanoDeMetasInicialComponent } from './plano-de-metas-inicial/plano-de-metas-inicial.component';
import { DialogModalPlanoMeta, PlanoMetasComponent } from './administracao/plano-metas/plano-metas.component';
import { PlanoMetasDetalhesComponent } from './administracao/plano-metas-detalhes/plano-metas-detalhes.component';
import { PlanoMetasListComponent } from './administracao/plano-metas-list/plano-metas-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatDialogModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, MatListModule, MatDividerModule, MatProgressBarModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatOptionModule, MatTableModule, MatSlideToggleModule, MatCheckboxModule, MatTabsModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SlugifyModule } from 'src/app/components/slugify/slugify.module';
import { NgxMaskModule } from 'ngx-mask';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [
    PlanoDeMetasCidadeComponent,
    PlanoDeMetasInicialComponent,
    PlanoMetasComponent,
    PlanoMetasDetalhesComponent,
    PlanoMetasListComponent,
    DialogModalPlanoMeta
  ],
  imports: [
    CommonModule,
    PlanoDeMetasRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    BreadcrumbModule,
    ChartsModule,
    NgxChartsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    SlugifyModule,
    FormsModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatOptionModule,
    MatTableModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTabsModule,
    AngularFontAwesomeModule,
    NgxMaskModule.forRoot(),
    MatRadioModule,
    DadosDownloadModule
  ],
  entryComponents: [DialogModalPlanoMeta],
})
export class PlanoDeMetasModule { }
