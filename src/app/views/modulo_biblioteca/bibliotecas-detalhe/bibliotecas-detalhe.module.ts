import { ShareModule } from '@ngx-share/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecasDetalheComponent } from './bibliotecas-detalhe.component';
import { BibliotecasDetalheRoutingModule } from './bibliotecas-detalhe-routing.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatTooltipModule, MatInputModule, MatOption, MatSelectModule, MatIcon, MatIconModule, MatRadioModule, MatDialogModule, MatAutocompleteModule, MatTabsModule, MatDividerModule, MatListModule, MatExpansionModule, MatProgressSpinnerModule } from '@angular/material';
import { KeysPipeModule } from 'src/app/components/keys-pipe/keys-pipe.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { MatCardModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [BibliotecasDetalheComponent],
  imports: [
    CommonModule,
    BibliotecasDetalheRoutingModule,
    BreadcrumbModule,
    NgxSummernoteModule,
    BreadcrumbModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    KeysPipeModule,
    AngularFontAwesomeModule,
    JwSocialButtonsModule,
    ShareModule,
    MatCardModule,
    LeafletModule.forRoot(),
    DadosDownloadModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ]
})
export class BibliotecasDetalheModule { }
