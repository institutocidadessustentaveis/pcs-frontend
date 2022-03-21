import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Indicador } from 'src/app/model/indicadores';
import { AvaliacaoVariavelService } from 'src/app/services/avaliacao-variavel.service';
import { AvaliacaoVariavelPreenchidaDetalhesDTO, AvaliacaoVariavelPreenchidaDTO } from '../avaliacao-variaveis/avaliacao-variaveis.component';
import { VariaveisPreenchidas } from 'src/app/model/variaveis-preenchidas';

export class AvaliacaoVariavel {
  id?: Number;
  prefeitura: string;
  prefeito: string;
  idVariavel?: Number;
  nomeVariavel: string;
  descricaoVariavel: string;
  valorPrefeitura: string;
  referencia: Array<Referencia>;
  valorResposta: string;
}

export class Referencia {
  id?: number = null;
  valorde: number;
  valorate: number;
  label: string;
  fonteReferencia: string;
  cor: string;
}

@Component({
  selector: 'app-avaliacao-variaveis-detalhes',
  templateUrl: './avaliacao-variaveis-detalhes.component.html',
  styleUrls: ['./avaliacao-variaveis-detalhes.component.css']
})
export class AvaliacaoVariaveisDetalhes implements OnInit {
  formDadosVariavel: FormGroup;
  listaVariavel: Array<AvaliacaoVariavelPreenchidaDTO>;
  Indicador: Indicador;
  blockSave: boolean = false;
  idHtml: number;

  @Input('objetoVariavel') variavel: AvaliacaoVariavelPreenchidaDetalhesDTO;
  scrollUp: any;

  constructor(public authService: AuthService, public formBuilder: FormBuilder,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public avaliacaoVariavelService: AvaliacaoVariavelService,
              private element: ElementRef) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.formDadosVariavel = this.formBuilder.group({
      idVariavelPreenchida: [''],
      idVariavel: [''],
      ano: [''],
      nome: [''],
      descricao: [''],
      valorPrefeitura: [''],
      valorResposta: ['', [Validators.required]],
      deGreen:[''],
      ateGreen:[''],
      deYellow:[''],
      ateYellow:[''],
      deOrange:[''],
      ateOrange:[''],
      deRed:[''],
      ateRed:[''],
    });
  }

  ngOnInit() {
    this.buscarVariaveis();
  }

  salvar() {
    let variavel: VariaveisPreenchidas = new VariaveisPreenchidas();
    let nomeVariavel:string;

    variavel.id = Number(this.formDadosVariavel.controls['idVariavelPreenchida'].value);
    variavel.idVariavel = Number(this.formDadosVariavel.controls['idVariavel'].value);
    nomeVariavel = this.formDadosVariavel.controls['nome'].value;
    variavel.ano = this.formDadosVariavel.controls['ano'].value;
    variavel.valorTexto = this.formDadosVariavel.controls['valorPrefeitura'].value;
    variavel.valor = this.formDadosVariavel.controls['valorResposta'].value;
    variavel.dataAvaliacao = new Date();
    variavel.status = "Avaliado";
    this.avaliacaoVariavelService.atualizarVariavel(variavel).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Avaliação de variáveis',
        text: `Variável ${nomeVariavel} atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.blockSave = true;
      }, error => { });
    }, error => { this.blockSave = true; });
  }

  buscarVariaveis() {
    this.idHtml = parseInt(this.variavel.idVariavelPreenchida.toString());
    this.formDadosVariavel.controls['idVariavelPreenchida'].setValue(this.variavel.idVariavelPreenchida);
    this.formDadosVariavel.controls['idVariavel'].setValue(this.variavel.idVariavel);
    this.formDadosVariavel.controls['nome'].setValue(this.variavel.nomeVariavel);
    this.formDadosVariavel.controls['descricao'].setValue(this.variavel.descricaoVariavel);
    this.formDadosVariavel.controls['valorPrefeitura'].setValue(this.variavel.valorPrefeitura);
    this.formDadosVariavel.controls['valorResposta'].setValue(this.variavel.valorResposta);

    if (this.variavel.referencia.length > 0 && this.variavel.referencia !== null && this.variavel.referencia !== undefined) {
      this.formDadosVariavel.controls['deGreen'].setValue(this.variavel.referencia.filter(x => x.cor === '#39FF33')[0].valorde);
      this.formDadosVariavel.controls['ateGreen'].setValue(this.variavel.referencia.filter(x => x.cor === '#39FF33')[0].valorate);
      this.formDadosVariavel.controls['deYellow'].setValue(this.variavel.referencia.filter(x => x.cor === '#FFFF00')[0].valorde);
      this.formDadosVariavel.controls['ateYellow'].setValue(this.variavel.referencia.filter(x => x.cor === '#FFFF00')[0].valorate);
      this.formDadosVariavel.controls['deOrange'].setValue(this.variavel.referencia.filter(x => x.cor === '#FFA500')[0].valorde);
      this.formDadosVariavel.controls['ateOrange'].setValue(this.variavel.referencia.filter(x => x.cor === '#FFA500')[0].valorate);
      this.formDadosVariavel.controls['deRed'].setValue(this.variavel.referencia.filter(x => x.cor === '#FF0000')[0].valorde);
      this.formDadosVariavel.controls['ateRed'].setValue(this.variavel.referencia.filter(x => x.cor === '#FF0000')[0].valorate);
    }
    else {
      this.formDadosVariavel.controls['deGreen'].setValue(0);
      this.formDadosVariavel.controls['ateGreen'].setValue(0);
      this.formDadosVariavel.controls['deYellow'].setValue(0);
      this.formDadosVariavel.controls['ateYellow'].setValue(0);
      this.formDadosVariavel.controls['deOrange'].setValue(0);
      this.formDadosVariavel.controls['ateOrange'].setValue(0);
      this.formDadosVariavel.controls['deRed'].setValue(0);
      this.formDadosVariavel.controls['ateRed'].setValue(0);
    }
  }

  getValorResposta() {
    return this.formDadosVariavel.get('valorResposta').hasError('required') ? 'O campo valor da avaliação é obrigatório' : '';
  }
}
