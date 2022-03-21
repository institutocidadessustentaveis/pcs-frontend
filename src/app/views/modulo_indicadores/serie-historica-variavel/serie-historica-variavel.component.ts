import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-serie-historica-variavel',
  templateUrl: './serie-historica-variavel.component.html',
  styleUrls: ['./serie-historica-variavel.component.css']
})
export class SerieHistoricaVariavelComponent implements OnInit {
  @Input() indicador;
  @Input() cidade;
  @Input() anoInicial;
  @Input() anoFinal;

  cabecalho = [];
  tabela = [];
  constructor(private vpService: VariavelPreenchidaService) { }

  ngOnInit() {
    this.vpService.buscarSerieHistoricaIndicadorCidade(this.indicador, this.cidade, this.anoInicial, this.anoFinal).subscribe(res =>{
      const resultado: any[] = res;
      this.cabecalho = resultado[0];
      resultado.shift();
      this.tabela = resultado;
    });
  }

  gerarDataSourceTabela(tabela) {
    return new MatTableDataSource(tabela);
  }

}
