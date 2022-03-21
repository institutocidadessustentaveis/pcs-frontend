import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainelComparativoIndicadoresCidadeComponent } from './painel-comparativo-indicadores-cidade.component';
import { IndicadoresDetalhesComponent } from './comparativo-indicadores-detalhes/indicadores-detalhes.component';
//import { PainelIndicadoresCidadeDetalhesComponent } from './painel-comparativo-indicadores-cidade-detalhes/painel-comparativo-indicadores-cidade-detalhes.component';
import { ChartsModule } from 'ng2-charts';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: PainelComparativoIndicadoresCidadeComponent,
  },
  {
    path: 'mostraCidades/:id/:nome',
    component: PainelComparativoIndicadoresCidadeComponent,
  },
  {
    path: 'detalhes/:id',
    component: IndicadoresDetalhesComponent,
  },
  {
    path: 'detalhes/:id',
    component: IndicadoresDetalhesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    ChartsModule,
    ShareModule,
    AngularFontAwesomeModule,
    NgxChartsModule  
  ],
  exports: [RouterModule]
})
export class PainelComparativoIndicadoresCidadeRoutingModule { }
