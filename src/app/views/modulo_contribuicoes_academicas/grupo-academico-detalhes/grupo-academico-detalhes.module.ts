
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoAcademicoDetalhesComponent } from './grupo-academico-detalhes.component';
import { MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatDividerModule, MatPaginatorModule, MatSortModule, MatFormField, MatExpansionModule, MatTooltipModule} from '@angular/material';
import { GrupoAcademicoDetalhesRoutingModule } from './grupo-academico-detalhes-routing.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
    declarations: [ GrupoAcademicoDetalhesComponent],
    imports: [
      CommonModule,
      BreadcrumbModule,
      GrupoAcademicoDetalhesRoutingModule,
      MatCardModule,
      LeafletModule.forRoot(),
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatDividerModule,
      MatPaginatorModule,
      MatSortModule,
      MatExpansionModule,
      NgxSummernoteModule,
      MatTooltipModule
    ]
  })
  export class GrupoAcademicoDetalhesModule { }
  