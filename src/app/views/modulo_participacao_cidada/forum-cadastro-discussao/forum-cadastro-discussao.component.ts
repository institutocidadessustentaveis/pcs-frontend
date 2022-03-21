import { TemaForumService } from './../../../services/tema-forum.service';
import { TemaForum } from 'src/app/model/tema-forum';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ForumDiscussaoService } from 'src/app/services/forum-discussao.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ForumDiscussao } from 'src/app/model/forum-discussao';
import { DiscussaoPerfil } from 'src/app/model/discursao-perfil';
import { PerfisService } from 'src/app/services/perfis.service';
import { Perfil } from 'src/app/model/perfil';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-forum-cadastro-discussao',
  templateUrl: './forum-cadastro-discussao.component.html',
  styleUrls: ['./forum-cadastro-discussao.component.css']
})



export class ForumCadastroDiscussaoComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;

  public form: FormGroup;
  public usuarioLogado: any;
  public perfis: Perfil[] = [];
  public podeAdicionarPerfil: boolean;
  public forumDiscussao = new ForumDiscussao();
  public discussaoPerfil = new DiscussaoPerfil();

  public loading = false;
  public modoEdicao = false;
  public temasForum: Array<TemaForum>;
  dataSource = new MatTableDataSource<DiscussaoPerfil>();
  displayedColumns: string[] = ['perfil', 'excluir'];
  public forumDiscussaoParaEditar: ForumDiscussao = new ForumDiscussao();
  public opcoesAutorizacao: Array<string> = [];

  public hiddenTable;

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

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private perfilService: PerfisService,
    public activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    public temaForumService: TemaForumService,
    private ForumDiscussaoservice: ForumDiscussaoService,
    private element: ElementRef,
  ) {
    this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.form = this.formBuilder.group({
      ativo: [false],
      publico: [],
      temasForum: [[]],
      titulo: [null, Validators.required],
      descricao: [null, Validators.required],
    });
    this.titleService.setTitle("Formulário de Discussão do Fórum - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.carregarTemasForum();
    this.verificarUsuarioLogado();
    this.buscarPerfis();
    this.buscarForum();

  }

  verificarUsuarioLogado() {
    this.usuarioLogado = localStorage.getItem('usuarioLogado');

    this.usuarioLogado = JSON.parse(this.usuarioLogado);

    this.usuarioLogado.listaPerfil.forEach(perfil => {
      if (perfil.id == 1 || perfil.id == 5) {
        this.podeAdicionarPerfil = true;
      }
    });
  }

  public onSelectPublicoChange(publico) {
    this.hiddenTable = publico;
    /*if (publico === true) {
      this.opcoesAutorizacao = []
    }
    else {
      this.opcoesAutorizacao = []
      this.opcoesAutorizacao.push("acessar")
    }   */ 
  }

  salvarPerfil() {    
    if (this.discussaoPerfil.perfil == null) {
      PcsUtil.swal().fire('Não foi possível adicionar', 'Verifique se o campo de perfil e autorização está devidamente preenchido', 'error');
    }
    else {
      this.discussaoPerfil.autorizacao = 'acessar';
      this.forumDiscussao.discussaoPerfis.push(this.discussaoPerfil);
      //this.converterAutorizacaoListEmString();

      this.discussaoPerfil = new DiscussaoPerfil();
      this.dialog.closeAll();
      this.table.renderRows();
    }
  }

  adicionarPerfil(templateRef) {
    this.dialog.open(templateRef, {
      width: '40%'
    });
  }

  verificarPerfilVazio() {
    let error;
    this.forumDiscussao.discussaoPerfis.forEach(x => {
      if (x.perfil == null || x.autorizacaoList.length == 0) {
        error = true;
        PcsUtil.swal().fire('Não foi possível adicionar perfil', 'Verifique se todos os perfis e autorizações da lista se encontram preenchidos antes de adicionar outro perfil', 'error');
      }
    });
  }

  salvarDiscussao() {
    let error = false;
    this.forumDiscussao.ativo = this.form.controls.ativo.value;
    this.forumDiscussao.titulo = this.form.controls.titulo.value;
    this.forumDiscussao.descricao = this.form.controls.descricao.value;
    this.forumDiscussao.publico = this.form.controls.publico.value == "true" ? true : false;
    this.forumDiscussao.prefeituraId = this.usuarioLogado.dadosPrefeitura ? this.usuarioLogado.dadosPrefeitura.id : null;
    this.forumDiscussao.temasForum = this.form.controls.temasForum.value ? this.form.controls.temasForum.value : null;
    this.forumDiscussao.usuarioCadastro = this.usuarioLogado.id;

    if (error) {
      return throwError("");
    }

    if (this.modoEdicao) {
      this.editarForumDiscussao();
    } else {
      this.cadastrarForumDiscussao();
    }
  }

  excluirAutorizacao(i) {
    this.forumDiscussao.discussaoPerfis.splice(i, 1);
    this.table.renderRows();
  }

  converterAutorizacaoListEmString() {
    let autorizacaoFormatada = '';
    this.discussaoPerfil.autorizacaoList.forEach((autorizacao, index) => {
      if (index == this.discussaoPerfil.autorizacaoList.length - 1) {
        autorizacaoFormatada += autorizacao
      } else {
        autorizacaoFormatada += autorizacao + ","
      }
    })

    this.discussaoPerfil.autorizacao = autorizacaoFormatada;
  }

  buscarPerfis() {
    if (this.podeAdicionarPerfil) {
      return this.perfilService.buscarPerfis().subscribe(res => {
        this.perfis = res.filter(item => {return item.nome !== 'Administrador'});
      })
    }
  }

  public buscarForum() {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params.id;
        if (id) {
          this.forumDiscussao.id = id;
          this.loading = true;
          this.ForumDiscussaoservice.buscarParaEdicao(id).subscribe( response => {
              this.forumDiscussaoParaEditar = response as ForumDiscussao;
              this.modoEdicao = true;
              this.carregarAtributosDiscussao();
              this.loading = false;
            },
            error => {
              this.router.navigate(["/participacao-cidada/discussoes"]);
            }
          );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(["/participacao-cidada/discussoes"]);
      }
    );
  }

  carregarAtributosDiscussao() {
    this.form.controls.titulo.setValue(
      this.forumDiscussaoParaEditar.titulo
    );
    this.form.controls.descricao.setValue(
      this.forumDiscussaoParaEditar.descricao
    );

    this.form.controls.ativo.setValue(
      this.forumDiscussaoParaEditar.ativo
    );
    this.forumDiscussao.discussaoPerfis = this.forumDiscussaoParaEditar.discussaoPerfis;
    this.form.controls.temasForum.setValue(
      this.buscarTemasForumSelecionados()
    );

    this.form.controls.publico.setValue(
      this.forumDiscussaoParaEditar.publico
    );
    /*if (this.forumDiscussaoParaEditar.publico === true) {
      this.opcoesAutorizacao.push("editar")
    }
    else {
      this.opcoesAutorizacao.push("editar")
      this.opcoesAutorizacao.push("acessar")
    }*/
  }

  cadastrarForumDiscussao() {
    this.loading = true;
    this.ForumDiscussaoservice.salvar(this.forumDiscussao).subscribe(res => {
      this.loading = false;
      PcsUtil.swal().fire('Discussão Criada', '', 'success').then(ok => {
        this.router.navigate(['/participacao-cidada/discussoes']);
      });

    }, error => {
      this.loading = false;
      PcsUtil.swal().fire('Não foi possível criar a discussão', error.error.message, 'error');
    });
  }

  editarForumDiscussao() {
    this.loading = true;    
    this.ForumDiscussaoservice.editar(this.forumDiscussao).subscribe(res => {
      this.loading = false;
      PcsUtil.swal().fire('Discussão Editada', '', 'success').then(ok => {
        this.router.navigate(['/participacao-cidada/discussoes']);
      });

    }, error => {
      this.loading = false;
      PcsUtil.swal().fire('Não foi possível editar a discussão', error.error.message, 'error');
    });
  }

  carregarTemasForum() {
    this.temaForumService.buscarListaTemaForum().subscribe(res => {
      this.temasForum = res as Array<TemaForum>;
    });
  }

  buscarTemasForumSelecionados() {
    const list = [];
    for (const e1 of this.forumDiscussaoParaEditar.temasForum) {
      for (const e2 of this.temasForum) {
        if (e1.id === e2.id) {
          list.push(e2);
          break;
        }
      }
    }
    return list;
  }

  validarSalvar() {
    if(!this.form.valid || this.loading) {
      return true;
    }
    return false;
  }

}
