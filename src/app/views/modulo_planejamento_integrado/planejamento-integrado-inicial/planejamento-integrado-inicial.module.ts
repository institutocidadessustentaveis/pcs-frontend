import { KeysPipeModule } from './../../../components/keys-pipe/keys-pipe.module';
import { ShapeItemAtributosModule } from './../../../components/shape-item-atributos/shape-item-atributos.module';
import { HasPerfilModule } from './../../../components/has-perfil/has-perfil.module';
import { ImportarPontosComponent } from './importar-pontos/importar-pontos.component';
import { BreadcrumbModule } from '../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatTabsModule, MatSnackBarModule} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { PlanejamentoIntegradoInicialRoutingModule } from './planejamento-integrado-inicial-routing.module';
import { PlanejamentoIntegradoInicialComponent } from './planejamento-integrado-inicial.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { CatalogoShapeComponent } from './catalogo-shape/catalogo-shape.component';

import { FiltroBoaPraticaComponent } from './filtro-boa-pratica/filtro-boa-pratica.component';
import { FiltroVariavelComponent } from './filtro-variavel/filtro-variavel.component';
import { FiltroIndicadorComponent } from './filtro-indicador/filtro-indicador.component';

import {MatSidenavModule} from '@angular/material/sidenav';

import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NovaCamadaComponent } from './nova-camada/nova-camada.component';
import { MesclarAtributosComponent } from './mesclar-atributos/mesclar-atributos.component';
import { EditarAtributosComponent } from './editar-atributos/editar-atributos.component';
import { DownloadAtributosComponent } from './download-atributos/download-atributos.component';
import { MapaTematicoComponent } from './mapa-tematico/mapa-tematico.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CriarPoligonoComponent } from './criar-poligono/criar-poligono.component';
import { OperacoesMatematicasCamadaComponent } from './operacoes-matematicas-camada/operacoes-matematicas-camada.component';
import { CriarLegendaComponent } from './criar-legenda/criar-legenda.component';
import { EditarPropriedadesComponent } from './editar-propriedades/editar-propriedades.component';
import { EditarPropriedadesFiltroComponent } from './editar-propriedades-filtro/editar-propriedades-filtro.component';
import { DialogClasseComponent } from './mapa-tematico/dialog-classe/dialog-classe.component';
import { PlanilhaAtributosComponent } from './planilha-atributos/planilha-atributos.component';
import { EditarPropriedadesTituloComponent } from './editar-propriedades-titulo/editar-propriedades-titulo.component';
import { FiltroPlanilhaComponent } from './planilha-atributos/filtro-planilha/filtro-planilha.component';
import { ExistPipeModule } from 'src/app/components/exist-pipe/exist-pipe.module';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';



@NgModule({
  declarations: [PlanejamentoIntegradoInicialComponent, FiltroBoaPraticaComponent,
                  FiltroVariavelComponent, CatalogoShapeComponent, FiltroIndicadorComponent,
                  ImportarPontosComponent, MesclarAtributosComponent, NovaCamadaComponent,
                  EditarAtributosComponent, DownloadAtributosComponent, MapaTematicoComponent,
                  CriarPoligonoComponent, OperacoesMatematicasCamadaComponent, CriarLegendaComponent,
                  EditarPropriedadesComponent, EditarPropriedadesFiltroComponent, DialogClasseComponent, EditarPropriedadesTituloComponent, 
                  PlanilhaAtributosComponent, FiltroPlanilhaComponent],
  imports: [
    CommonModule,
    PlanejamentoIntegradoInicialRoutingModule,
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
    MatDialogModule,
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    DragDropModule,
    NgxMaskModule.forRoot(),
    ScrollToModule.forRoot(),
    LeafletModule.forRoot(),
    MatProgressSpinnerModule,
    BreadcrumbModule,
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule,
    LeafletDrawModule.forRoot(),
    MatSidenavModule,
    ColorPickerModule,
    HasPerfilModule,
    ShapeItemAtributosModule,
    KeysPipeModule,
    MatSnackBarModule,
    DadosDownloadModule
  ],
  entryComponents: [EditarAtributosComponent, CriarPoligonoComponent, 
    CriarLegendaComponent, EditarPropriedadesComponent, 
    EditarPropriedadesFiltroComponent,
    DialogClasseComponent, EditarPropriedadesTituloComponent],
  
})
export class PlanejamentoIntegradoInicialModule { }
