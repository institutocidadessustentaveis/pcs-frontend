import { Usuario } from 'src/app/model/usuario';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TemaForum } from 'src/app/model/tema-forum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FiltroForum } from 'src/app/model/filtroForum';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TemaForumService } from 'src/app/services/tema-forum.service';
import { PerfilUsuarioForum } from 'src/app/model/perfil-usuario-forum';
import { ForumDiscussaoService } from 'src/app/services/forum-discussao.service';
import { PerfilUsuarioForumService } from './../../../services/perfil-usuario-forum';
import { ForumDiscussaoPrincipal } from './../../../model/forum-discussao-principal';

@Component({
  selector: 'app-forum-principal',
  templateUrl: './forum-principal.component.html',
  styleUrls: ['./forum-principal.component.css']
})
export class ForumPrincipalComponent implements OnInit {

  loading = false;
  usuarioLogado: Usuario;
  public formFiltro: FormGroup;
  perfilUsuarioForum: PerfilUsuarioForum;
  public temasForum: Array<TemaForum> = [];
  public usuarioEstaLogado: boolean = false;
  public discussoesForum: ForumDiscussaoPrincipal[];
  public filtroForum: FiltroForum = new FiltroForum();


  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private temaForumService: TemaForumService,
    private forumDiscussaoService: ForumDiscussaoService,
    private perfilUsuarioForumService: PerfilUsuarioForumService,
  ) { this.formFiltro = this.formBuilder.group({
        palavraChave: [''],
        idsTemas: ['']
    });
      this.route.queryParams.subscribe(params => {
        this.formFiltro.controls.palavraChave.setValue(params['palavrachave']);
        params['temas'] ? this.formFiltro.controls.idsTemas.setValue(params['temas'].split(',').map(x=>+x)) : ''; //Converte parametro string em array de number
    });
    this.titleService.setTitle(`Fórum - Cidades Sustentáveis`);
  }

  ngOnInit() {
    this.buscarDiscussoesFiltradas(false);
    //this.verificaUsuario();
    this.carregarTemasForum();
  }


  public verificaUsuario() {
    this.usuarioEstaLogado = this.authService.isAuthenticated();
    if (this.usuarioEstaLogado) {
      this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        this.usuarioLogado = usuario;
        //Verificando se tem permissão para acessar o fórum
        if (this.usuarioLogado.bloqueadoForum) {
          PcsUtil.swal().fire({
            title: 'Acesso ao Fórum',
            text: `Não é possível acessar o fórum com este perfil.`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
            this.router.navigate(['/']);
          }, error => { });
        }
        this.verificaPerfilUsuarioForum();
      });
    }
  }

  //Verificando se tem um perfil de contato
  public verificaPerfilUsuarioForum() {
    this.perfilUsuarioForumService.buscarPerfilPorIdUsuario(this.usuarioLogado.id).subscribe(perfil => {
      if (!perfil) {
        PcsUtil.swal().fire({
          title: 'Perfil',
          text: `Insira suas informações públicas de contato para acessar o Fórum`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/participacao-cidada/forum/perfil-usuario']);
        }, error => { });
      }
    })
  }

  carregarTemasForum() {
    this.temaForumService.buscarListaTemaForum().subscribe(res => {
      this.temasForum = res as Array<TemaForum>;
    });
  }

  public construirParamsURL(){
    this.filtroForum.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.filtroForum.idsTemas = this.formFiltro.controls.idsTemas.value;

    if(this.filtroForum.palavraChave === undefined){
      this.filtroForum.palavraChave = '';
    }

    if(this.filtroForum.idsTemas === undefined){
      this.filtroForum.idsTemas = null;
    }

    let new_URL = this.filtroForum.palavraChave ?
    `/participacao-cidada/forum?palavrachave=${this.filtroForum.palavraChave}` : "/participacao-cidada/forum";
    this.filtroForum.idsTemas ? 
    (new_URL ? new_URL += `&temas=${this.filtroForum.idsTemas}` : `/participacao-cidada/forum`) : "";

    window.history.replaceState( {} , '', new_URL );
  }

  buscarDiscussoesFiltradas(rolarParaDiv) {
    this.construirParamsURL();
    this.loading = true;
  

    this.forumDiscussaoService.buscarDiscussoesFiltradas(this.filtroForum).subscribe(  res => {
      this.discussoesForum = res;
      this.loading = false;

      if(res.length > 0 && rolarParaDiv){
        let el = document.getElementById('filtro-discussoes');
        el.scrollIntoView();
      }
    });

  }

  
  public limparFiltro() {
    this.formFiltro.controls['palavraChave'].setValue(null);
    this.formFiltro.controls['idsTemas'].setValue(null);
    this.buscarDiscussoesFiltradas(false);
  }

  definirStatus(status: boolean) {
    if (status) {
      return {'background-color': '#38b000', 'margin-right': '1px', 'border-radius': '20px'};
    } else {
      return {'background-color': '#d00000', 'margin-right': '1px', 'border-radius': '20px'};
    }
  }

  definirTooltip(status: boolean) {
    if(status) {
      return 'Ativo'
    } else {
      return 'Inativo'
    }
  }

}
