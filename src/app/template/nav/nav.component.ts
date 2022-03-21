import { environment } from 'src/environments/environment';
import { element } from 'protractor';
import { WebSocketEchoService } from 'src/app/services/web-socket-echo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EventEmitter, AfterViewInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { AlertaService } from './../../services/alerta.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavService } from '../menu-list-item/nav.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { NavItemService } from 'src/app/services/nav-item.service';
import { NavItem } from 'src/app/model/nav-item';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit, AfterViewInit {

    idPrefeitura: number = null;

    public cadastroTerritorialRoles: string[] = ['ROLE_VISUALIZAR_PAIS', 'ROLE_VISUALIZAR_ESTADO', 'ROLE_VISUALIZAR_CIDADE'];

    public administracaoUsuarioRoles: string[] = ['ROLE_VISUALIZAR_HISTORICO_OPERACAO', 'ROLE_ADMINISTRAR_PREMIACOES',
    'ROLE_RELATORIOS', 'ROLE_VISUALIZAR_USUARIO', 'ROLE_VISUALIZAR_PERFIL'];

    public institucionalRoles: string[] = ['ROLE_CADASTRAR_PAGINA_INSTITUCIONAL', 'ROLE_CADASTRAR_MATERIAL_INSTITUCIONAL'];

    @ViewChild('sidenav') sidenav: any;

    public navItems: NavItem[];

    private initUsuarioLogado: string ;

    subscription: Subscription;

    scrollUp: any;

    public rotasCadastroEdicao: string[] = [
      '/plano-de-metas/administracao', '/dados_cidade', '/subdivisao/tipo-subdivisao', '/subdivisao/administracao-subdivisao', 
      '/indicadores/preencher-variaveis', '/preencher-indicador', '/cadastroCidadao', '/cadastrar-carta-compromisso/cadastrar',
      '/material_institucional/cadastrar', '/faq-formulario', '/institucional-interno/cadastrar',
      '/planejamento-integrado/temas-geoespaciais/cadastro', '/planejamento-integrado/sig', 
      '/planejamento-integrado/cadastro-shapefile/cadastrar', '/proposta', '/cadastroindicadores/cadastrar', 
      '/variaveis/cadastrar', '/eixo/cadastrar', '/ods/cadastrar', '/avaliacaoVariavel/avaliacao', 
      '/cadastro-boas-praticas/cadastrar', '/sugerir-boa-pratica', '/configuracao-comentario', 
      '/participacao-cidada/formulario/cadastrar', '/mural-de-comentarios-form', '/cadastro-noticia/cadastrar',
      '/boletim/cadastrar', '/biblioteca/administracao/cadastrar', '/eventos/cadastro', '/eventos/cadastro', 
      '/participacao-cidada/forum/discussao','/participacao-cidada/forum/cadastro-discussao', '/biblioteca/temas-forum/cadastrar',
      '/colaboracoes-academicas/grupos-academicos/administracao/cadastrar', '/capacitacao/certificados/cadastrar',
      '/perfis/cadastrar', '/usuarios/cadastrar', '/usuario-prefeitura/cadastrar', '/premiacaoAdmin/cadastrar', 
      '/pais/cadastrar', '/estado-provincia/cadastrar', '/cidade/cadastrar', '/rodape', '/paginas-editor/cadastrar', '/menu',
      '/home/cadastrar', '/aprovacao-prefeitura', '/editar/' 
    ]

    constructor(private breakpointObserver: BreakpointObserver,
                public router: Router,
                public authService: AuthService,
                private navService: NavService,
                private alertaService: AlertaService,
                private usuarioService: UsuarioService,
                private wsEcho: WebSocketEchoService,
                private element: ElementRef ,
                private navItemService: NavItemService) {
                this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
                });

                }



    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches)
      );


    ngAfterViewInit() {
      this.navService.sidenav = this.sidenav;
    }

    openSideNav() {
      this.sidenav.toggle();

      //mantem o item da lista aberto
      this.verificaNavegacaoMesmoUsuario();
    }

    getQuantidade() {
      if (this.isAuthenticated() && this.hasRole('ROLE_VISUALIZAR_ALERTA')) {
        return this.alertaService.qtdNovos;
      }
    }

    private verificaNavegacaoMesmoUsuario() {
      let atualUsuario = null;
      if (localStorage.getItem('usuarioLogado') !== null) {
        atualUsuario = JSON.parse(localStorage.getItem('usuarioLogado')).login;
      }

      if (this.initUsuarioLogado !== atualUsuario) {
          this.initNavItems();
          this.initUsuarioLogado = atualUsuario;
      } else if (!this.navItems) {
          this.initNavItems();
      }
    }

    ngOnInit() {
      if (localStorage.getItem('usuarioLogado') !== null && localStorage.getItem('usuarioLogado') !== undefined ) {
        if(JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura) {
          this.idPrefeitura = Number(JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura.id);
        } else{
          this.idPrefeitura = 0;
        }
      } else {
        this.idPrefeitura = 0;
      }

      if (localStorage.getItem('usuarioLogado') !== null) {
        this.initUsuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')).login;
      } else {
        this.initUsuarioLogado = null;
      }

      //this.initNavItems();

      if (this.isAuthenticated() && this.hasRole('ROLE_VISUALIZAR_ALERTA')) {
        this.subscription = timer(0, 1000 * (60 * 5)).pipe(
          switchMap(() => this.alertaService.getQuantidade())
        ).subscribe(
          res => {
            this.alertaService.qtdNovos = res as number;
          }
        );
      }
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    async logout() {
      const rotaCadastroEdicao = await this.validarRota();
      if(rotaCadastroEdicao) {
        PcsUtil.swal().fire({
          title: 'Logout',
          text: `Deseja realmente sair antes de salvar o formulário?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          reverseButtons: false
        }).then((result) => {
          if(result.value) {
            this.realizarLogout();
          } 
        });
      } else {
        this.realizarLogout();
      }

    }

    validarRota() {
      let rotaIncluida = false;
      this.rotasCadastroEdicao.forEach(rota => {
        if(this.router.url.includes(rota)) {
          rotaIncluida = true;
        }});
      if(rotaIncluida) {
        return true;
      } else {
        return false;
      }
    }

    realizarLogout() {
      const username = this.authService.credencial.nome;
      this.sidenav.close();
      this.authService.logout();
      this.alertaService.qtdNovos = 0;
      PcsUtil.swal().fire({
        title: 'Sessão finalizada',
        text: `Olá, ${username}, sessão finalizada com sucesso!`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/login']);
        localStorage.clear();
      }, error => { });
    }

    private callPlanoMetas(): string {
      if (localStorage.getItem('usuarioLogado') !== null && localStorage.getItem('usuarioLogado') !== undefined) {
        if (Boolean(JSON.parse(localStorage.getItem('usuarioLogado')).usuarioPrefeitura) === true) {
          this.idPrefeitura = Number(JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura.id);
          return '/planoMetas/' + this.idPrefeitura;
        } else {
          return'/planoMetas';
        }
      }
    }

    public hasRole(role: string): boolean {
      return this.authService.hasRole(role);
    }

    public haveRoles(roles: string[]): boolean {
      let value = false;
      roles.forEach(role => {
        if (this.authService.hasRole(role)) {
          value = true;
        }
      });
      return value;
    }

    public isUsuarioPrefeitura(): boolean {
      return this.authService.isUsuarioPrefeitura();
    }

    public isAuthenticated() {
      return this.authService.isAuthenticated();
    }

    visualizarPerfilUsuarioLogado() {
      const idUsuarioLogado = this.authService.credencial.id;
      this.router.navigate([`/meusdados/${idUsuarioLogado}`]);
    }


    private initNavItems() {
      this.navItemService.buscar().subscribe(async response => {
        this.navItems = response as NavItem[];
      });
    }
  }
