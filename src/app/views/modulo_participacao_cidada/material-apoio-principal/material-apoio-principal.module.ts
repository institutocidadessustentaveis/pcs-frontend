
import { ItemMaterialApoioModule } from './../item-material-apoio/item-material-apoio.module';
import { ShareModule } from '@ngx-share/core';
import { DatepickerPCSModule } from './../../../components/datepicker/datepickerpcs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatProgressBarModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatAutocompleteModule, MatRadioModule, MatDialogModule } from '@angular/material';
import { MaterialApoioPrincipalComponent } from './material-apoio-principal.component';
import { MaterialApoioPrincipalRoutingModule } from './material-apoio-principal-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialApoioDetalheComponent } from '../material-apoio-detalhe/material-apoio-detalhe.component';
import { TempoPercorridoModule } from 'src/app/components/tempo-percorrido/tempo-percorrido.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [
    MaterialApoioPrincipalComponent, 
    MaterialApoioDetalheComponent,
  ],
  imports: [
    CommonModule,
    MaterialApoioPrincipalRoutingModule,
    MatProgressBarModule,
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
    MatAutocompleteModule,
    MatRadioModule,
    MatDialogModule,
    DadosDownloadModule
  ]
  
})
export class MaterialApoioPrincipalModule { }
