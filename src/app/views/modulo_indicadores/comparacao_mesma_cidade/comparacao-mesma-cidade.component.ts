
import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Cidade } from 'src/app/model/cidade';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { Router } from '@angular/router';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-comparar-indicadores-diferentes-mesmacidade',
  templateUrl: './comparacao-mesma-cidade.component.html',
  styleUrls: ['./comparacao-mesma-cidade.component.css']
})
export class CompararIndicadoresDiferentesMesmaCidadeComponent implements OnInit {

  listaCidade: Array<Cidade> = new Array<Cidade>();

  listaAnosIndicadoresCidade: Array<number> = new Array<number>();

  selectedItem: any = '';
  inputChanged: any = '';
  keyword = 'nome';
  idCidade: number;

  anoSelecionado: number;
  scrollUp: any;

  constructor(public painelIndicadorCidadeService: PainelIndicadorCidadeService, public authService: AuthService,
              private changeDetectorRefs: ChangeDetectorRef,private element: ElementRef
              ,private router: Router ) {this.scrollUp = this.router.events.subscribe((path) => {
                element.nativeElement.scrollIntoView();
              });
              }


  ngOnInit() {

  }


  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  private buscarCidades(nome: string) {
    this.painelIndicadorCidadeService.buscarCidadesPorNomeComIndicadoresPreenchidos(nome).subscribe(response => {
      this.listaCidade = response as Array<Cidade>;
    });
  }

  selectEvent(item) {
    this.idCidade = item.id;
    if (this.idCidade) {
      this.anoSelecionado = null;
    }

    this.painelIndicadorCidadeService.buscarAnosIndicadoresPorPrefeitura(item.idPrefeitura).subscribe(response => {
      this.listaAnosIndicadoresCidade = response as Array<any>;
    });
  }

  onChangeSearch(search: string) {
    if (search){
      this.buscarCidades(search);
    }
  }

  public onChangeAnoIndicador() {
    this.changeDetectorRefs.detectChanges();
  }

}
