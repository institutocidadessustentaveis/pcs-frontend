import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { Router } from '@angular/router';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { runInThisContext } from 'vm';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-lista-indicadores-eixo',
  templateUrl: './lista-indicadores-eixo.component.html',
  styleUrls: ['./lista-indicadores-eixo.component.css']
})
export class ListaIndicadoresEixoComponent implements OnInit {

  @Input() eixo: number = null;
  @Input() cidade: number = null;
  @Input() anoInicial: number = null;
  @Input() anoFinal: number = null;

  @Input() siglaEstado = null;
  @Input() nomeCidade = null;

  public tabela: Array<any>;
  carregando = true;
  tabelaVariacaoReferencias = [];
  scrollUp: any;

  constructor(public painelIndicadorCidadeService: PainelIndicadorCidadeService,
              private element: ElementRef,
              private router: Router) {
    this.tabela = [];
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarTabelas();
  }

  buscarTabelas() {
    if (this.eixo) {
      this.painelIndicadorCidadeService.buscarTabelas(this.eixo, this.cidade, this.anoInicial, this.anoFinal).subscribe(res => {
        this.tabela = res;
       
        this.carregando = false;
      });
    } else {
      this.painelIndicadorCidadeService.buscarTabelasIndicadoresDaCidade(this.cidade, this.anoInicial, this.anoFinal).subscribe(res => {
        this.tabela = res;
        
        this.carregando = false;
      });
    }

  }

  selecionar(linha){
    linha[6] = true;
  }

  geradorURL(idIndicador) {
    this.nomeCidade = PcsUtil.toSlug(this.nomeCidade);
    let url = `/indicador/${idIndicador}/${this.siglaEstado}/${this.nomeCidade}`;
    return url;
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }

}
