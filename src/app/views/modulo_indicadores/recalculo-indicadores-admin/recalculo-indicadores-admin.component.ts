import { Component, OnInit } from '@angular/core';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';

@Component({
  selector: 'app-recalculo-indicadores-admin',
  templateUrl: './recalculo-indicadores-admin.component.html',
  styleUrls: ['./recalculo-indicadores-admin.component.css']
})
export class RecalculoIndicadoresAdminComponent implements OnInit {

  constructor(public service:IndicadoresPreenchidosService) { }
  indicadores = '';

  ngOnInit() {
  }

  recalcular(){
    let lista = this.indicadores.split(',');
    this.recalcularRecursivo(lista,0);
  }

  recalcularRecursivo(lista:any[],indice: number ){
    if(indice < lista.length){
      let idIndicador: string = (lista[indice]);
      idIndicador = idIndicador.trim();
      console.log(`Iniciando o ID: ${idIndicador}`);
      this.service.recalcularIndicador(idIndicador).subscribe(()=>{
        console.log(`Finalizado o ID: ${idIndicador}`);
        indice = indice+1;
        this.recalcularRecursivo(lista,indice);
      });
    } else {
      console.log('acabou')
    }
  }
}
