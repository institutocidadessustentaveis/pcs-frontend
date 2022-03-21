import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-variavel-preenchida',
  templateUrl: './lista-variavel-preenchida.component.html',
  styleUrls: ['./lista-variavel-preenchida.component.css']
})
export class ListaVariavelPreenchidaComponent implements OnInit {

  @Input() indicador: number = null;
  @Input() cidade: number = null;
  @Input() anoInicial: number = null;
  @Input() anoFinal: number = null;
  @Input() idVariavel: number = null;
  @Input() idSubdivisao: number = null;

  @Input() carregando = true;
  tabela = [];
  scrollUp: any;
  constructor(public painelService : PainelIndicadorCidadeService,private element: ElementRef
    ,private router: Router) {this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
  }); }

  ngOnInit() {
    this.buscarVariaveis();
  }

  buscarVariaveis() {
    this.painelService.buscarVariaveis(this.indicador, this.cidade, this.anoInicial, this.anoFinal, this.idSubdivisao)
      .subscribe(res => {
        this.tabela = res;
        
        if(this.idVariavel){
          this.tabela = this.tabela.filter(variavel => variavel[0] == this.idVariavel);
        }
        this.carregando = false;
    });
    
  }

}
