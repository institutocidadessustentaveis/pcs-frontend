import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EixoService } from 'src/app/services/eixo.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-formulario-form',
  templateUrl: './formulario-form.component.html',
  styleUrls: ['./formulario-form.component.css']
})
export class FormularioFormComponent implements OnInit {

  public formFormulario: FormGroup;
  public formSecao: FormGroup;
  public formPergunta: FormGroup;
  public formResposta: FormGroup;
  public editorConfig: any = {
    height: '150px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'picture', 'link']],
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste(e) { const bufferText = ((e.originalEvent || e).clipboardData).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  listaEixo = [];
  listaOds = [];
  listaTodosOds = [];
  listaTemas = [];
  usuarioPrefeitura = false;

  cadastrandoSecao = false;
  listaSecao = [];
  secaoSelecionada: any  ;
  indiceIdSecao = -1;
  indiceIdPergunta = -1;
  indiceIdResposta = -1;

  cadastrandoPergunta = false;
  listaPerguntasSecao = [];
  perguntaSelecionada: any = {respostas : []};
  listaRespostas = [];

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public router: Router,
              private formularioService: FormularioService,
              private eixoService: EixoService,
              private odsService: ObjetivoDesenvolvimentoSustentavelService,
              private areaInteresseService: AreaInteresseService,
              private authService: AuthService) {
    this.formFormulario = this.formBuilder.group({
      id: [null],
      ods: [null],
      link: [null],
      temas: [null],
      eixos: [null],
      nome: [null, Validators.required],
      descricao: [null, Validators.required],
      publicado: [false, Validators.required],
      tipoUsuario: ['todos', Validators.required],
      apenasAutenticados: [false, Validators.required],
      fimPeriodoAtividade: [null, Validators.required],
      inicioPeriodoAtividade: [null, Validators.required],
      exibirPaginaPrefeitura : [false, Validators.required],
    });
    this.formSecao = this.formBuilder.group({
      id: [null],
      nome: [null, Validators.required],
    });
    this.formPergunta = this.formBuilder.group({
      id: [null],
      ordem: [null, Validators.required],
      tipo: ['SimNao', Validators.required],
      pergunta: [null, Validators.required],
      multiplaSelecao: [false, Validators.required],
    });

    this.formResposta = this.formBuilder.group({
      id: [null],
      resposta: [null, Validators.required],
    });

   }

  ngOnInit() {
    this.buscarFormulario();
    this.atualizaUsuarioPrefeitura();
    this.carregarEixos();
    this.carregarOds();
    this.carregarTemas();
  }
  buscarFormulario() {
    this.activatedRoute.params.subscribe(async params => {
      const id = params.id;
      if (id) {
        this.formularioService.buscarPorId(id).subscribe(res => {
          this.listaSecao = res.secoes;
          this.formFormulario.controls.id.setValue(res.id);
          this.formFormulario.controls.ods.setValue(res.ods);
          this.formFormulario.controls.nome.setValue(res.nome);
          this.formFormulario.controls.link.setValue(res.link);
          this.formFormulario.controls.eixos.setValue(res.eixos);
          this.formFormulario.controls.temas.setValue(res.temas);
          this.formFormulario.controls.descricao.setValue(res.descricao);
          this.formFormulario.controls.publicado.setValue(res.publicado);
          this.formFormulario.controls.tipoUsuario.setValue(res.tipoUsuario);
          this.formFormulario.controls.apenasAutenticados.setValue(res.apenasAutenticados);
          this.formFormulario.controls.fimPeriodoAtividade.setValue(res.fimPeriodoAtividade);
          this.formFormulario.controls.inicioPeriodoAtividade.setValue(res.inicioPeriodoAtividade);
          this.formFormulario.controls.exibirPaginaPrefeitura.setValue(res.exibirPaginaPrefeitura);

        });
      }

    });

  }

  carregarEixos() {
    this.eixoService.buscarEixosParaCombo(false).subscribe(eixos => {
      this.listaEixo = eixos;
    });
  }
  carregarOds() {
    this.odsService.buscarOdsCombo().subscribe(odss => {
      this.listaTodosOds = odss;
      this.listaOds = odss;
    });
  }
  carregarTemas() {
    this.areaInteresseService.buscaAreasInteresses().subscribe(temas => {
      this.listaTemas = temas;
    });
  }

  mudarEixo(valor) {
    if (valor) {
      const eixos: any = this.listaEixo.filter(eixo => valor.indexOf(eixo.id) > -1);
      this.listaOds = [];
      eixos.forEach(eixo => {
        eixo.listaODS.forEach(ods => {
          const obj = this.listaOds.filter(_ods => _ods.id == ods.id);
          if (obj.length == 0) {
            this.listaOds.push(ods);
          }
         });
       });
      this.listaOds.sort((a, b) => {
        if (a.id > b.id) { return 1; }
        if (a.id < b.id) { return -1; }
        return 0;
      } );
      this.formFormulario.controls.ods.setValue(null);
    } else {
      this.listaOds = this.listaTodosOds;
    }
  }

  atualizaUsuarioPrefeitura() {
    this.usuarioPrefeitura = this.authService.isUsuarioPrefeitura();
  }

  habilitarCadastroSecao() {
    this.cadastrandoSecao = !this.cadastrandoSecao;
  }

  habilitarCadastroPergunta(secao) {
    if (secao) {
      this.secaoSelecionada = secao;
    }
    this.cadastrandoPergunta = !this.cadastrandoPergunta;
    if (!this.cadastrandoPergunta) {
      this.formPergunta.reset();
      this.formPergunta.controls.tipo.setValue('SimNao');
      this.formPergunta.controls.multiplaSelecao.setValue(false);
      this.secaoSelecionada = null;
    }
  }

  editarSecao(index)  {
    const secao = this.listaSecao[index];
    this.listaPerguntasSecao = secao.perguntas;
    this.formSecao.controls.id.setValue(secao.id);
    this.formSecao.controls.nome.setValue(secao.nome);
    this.habilitarCadastroSecao();
  }

  editarPergunta(secao, pergunta) {
    this.perguntaSelecionada = pergunta;
    this.formPergunta.controls.id.setValue(pergunta.id);
    this.formPergunta.controls.tipo.setValue(pergunta.tipo);
    this.formPergunta.controls.ordem.setValue(pergunta.ordem) ;
    this.formPergunta.controls.pergunta.setValue(pergunta.pergunta);
    this.formPergunta.controls.multiplaSelecao.setValue(pergunta.multiplaSelecao);
    this.habilitarCadastroPergunta(secao);
  }

  excluirSecao(index) {
    this.listaSecao.splice(index, 1);
  }

  excluirPergunta(indexSecao, indexPergunta) {
    this.listaSecao[indexSecao].perguntas.splice(indexPergunta, 1);
  }

  excluirResposta(indexResposta) {
    this.perguntaSelecionada.respostas.splice(indexResposta, 1);
  }

  salvarSecao() {
    const secao = this.formSecao.value;
    if (!secao.id) {
      secao.id = this.indiceIdSecao--;
    }
    if ( !secao.perguntas ) {
      secao.perguntas = [];
    }

    const secoes = this.listaSecao.filter( filtroRegistro => filtroRegistro.id == secao.id);
    if (secoes && secoes.length > 0) {
      const indexSecao = this.listaSecao.map(a => a.id).indexOf(secao.id);
      secao.ordem = indexSecao;
      this.listaSecao[indexSecao] = secao;
    } else {
      secao.ordem = this.listaSecao.length + 1;
      this.listaSecao.push(secao);
    }
    this.habilitarCadastroSecao();
    this.formSecao.reset();
  }

  salvarPergunta() {
    const pergunta = this.formPergunta.value;
    if (!pergunta.id) {
      pergunta.id = this.indiceIdPergunta--;
    }
    if (!pergunta.respostas) {
      pergunta.respostas = [];
    }
    const perguntasExiste = this.secaoSelecionada.perguntas.filter(_pergunta => _pergunta.id == pergunta.id);
    if (perguntasExiste && perguntasExiste.length > 0) {
      this.perguntaSelecionada.id = pergunta.id;
      this.perguntaSelecionada.pergunta = pergunta.pergunta;
      this.perguntaSelecionada.ordem = pergunta.ordem;
      this.perguntaSelecionada.tipo = pergunta.tipo;
      this.perguntaSelecionada.multiplaSelecao = pergunta.multiplaSelecao;
    } else {
      pergunta.ordem = this.secaoSelecionada.perguntas.length + 1;
      pergunta.respostas = this.perguntaSelecionada.respostas;
      this.secaoSelecionada.perguntas.push(pergunta);
    }
    this.habilitarCadastroPergunta(null);

    this.perguntaSelecionada = {respostas: []};
  }

  salvarResposta() {
    const resposta = this.formResposta.value;
    if (!resposta.id) {
      resposta.id = this.indiceIdResposta--;
    }
    if (!resposta.ordem) {
      resposta.ordem = this.perguntaSelecionada.respostas.lenght + 1;
    }

    if (resposta.id > 0) {

    } else {
      this.perguntaSelecionada.respostas.push(resposta);
      this.formResposta.reset();
    }

  }

  salvarFormulario() {
    const formulario = this.formFormulario.value;
    formulario.secoes = this.listaSecao;
    if (formulario.id) {
      this.formularioService.atualizar(formulario).subscribe(r => {
        PcsUtil.swal().fire('Formulário Salvo', '', 'success').then(ok => {
          this.router.navigate(['/participacao-cidada/formulario']);
        });
      }, error => {
        PcsUtil.swal().fire('Não foi possível salvar o formulário', error.error.message, 'error');
      });
    } else {
      this.formularioService.salvar(formulario).subscribe(r => {
        PcsUtil.swal().fire('Formulário Salvo', '', 'success').then(ok => {
          this.router.navigate(['/participacao-cidada/formulario']);
        });
      }, error => {
        PcsUtil.swal().fire('Não foi possível salvar o formulário', error.error.message, 'error');
      });
    }
  }



}
