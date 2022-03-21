import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Variavel } from 'src/app/model/variaveis';
import { Indicador } from 'src/app/model/indicadores';
import { AvaliacaoVariavelService } from 'src/app/services/avaliacao-variavel.service';
import { VariavelReferencia } from 'src/app/model/variaveis-referencia';

export class AvaliacaoVariavelPreenchidaDTO {
  id?: Number;
  prefeitura: string;
  prefeito: string;
  nomeIndicador: string;
  anoIndicador: string;
  avaliacaoVariavelPreenchidaDetalhesDTO: Array<AvaliacaoVariavelPreenchidaDetalhesDTO>;
}

export class AvaliacaoVariavelPreenchidaDetalhesDTO {
  idIndicadorPreenchido?:Number;
  idVariavelPreenchida?: Number;
  idVariavel?: Number;
  nomeVariavel: string;
  descricaoVariavel: string;
  valorPrefeitura: string;
  valorResposta: string;
  referencia: Array<VariavelReferencia>;
}

@Component({
  selector: "app-avaliacao-variaveis",
  templateUrl: "./avaliacao-variaveis.component.html",
  styleUrls: ["./avaliacao-variaveis.component.css"]
})
export class AvaliacaoVariaveisComponent implements OnInit {
  loading: any;
  formPrefeitura: FormGroup;
  variavelSelecionada: Variavel;
  listaVariavel: Array<AvaliacaoVariavelPreenchidaDetalhesDTO>;
  listaIndicador: Array<AvaliacaoVariavelPreenchidaDTO>;
  Indicador: Indicador;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    public avaliacaoVariavelService: AvaliacaoVariavelService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formPrefeitura = this.formBuilder.group({
      prefeitura: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      nome: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.buscarDados();
    this.loading = false;
  }

  buscarDados() {
    this.activatedRoute.params.subscribe(
      async params => {
        let id = params.id;
        if (id) {
          let novoIndicador: Indicador;
          this.avaliacaoVariavelService.buscarPorIdPrefeitura(id).subscribe(
            response => {
              this.listaIndicador = new Array<AvaliacaoVariavelPreenchidaDTO>();
              this.listaVariavel = new Array<
                AvaliacaoVariavelPreenchidaDetalhesDTO
              >();
              for (const itemIndicador of response) {
                this.formPrefeitura.controls["prefeitura"].setValue(
                  itemIndicador.prefeitura
                );
                this.formPrefeitura.controls["nome"].setValue(
                  itemIndicador.prefeito
                );
                this.listaIndicador.push(itemIndicador);
              }
            },
            error => {
              this.loading = false;
            }
          );
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
