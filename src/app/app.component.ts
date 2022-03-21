import { Component, ElementRef } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './services/auth.service';
import { PcsUtil } from './services/pcs-util.service';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { WebSocketEchoService } from './services/web-socket-echo.service';
import { SeoService } from './services/seo-service.service';


declare let gtag: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  paginaAnterior: string;
  private tempoSessao = 43200; // 12h
  scrollUp: any;
  usuarioEstaLogado = false;

  constructor(public authService: AuthService,
              public router: Router,
              private activateRouter: ActivatedRoute,
              private element: ElementRef,
              private seoService: SeoService) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    setInterval(() => {
      if (this.authService.isAuthenticated()) {
        this.sessaoExpirada();
      }
    }, 5000);


    setInterval(() => {
      const autenticado = this.authService.isAuthenticated();
      if (this.usuarioEstaLogado) {
        if (!this.authService.isAuthenticated()) {
          this.usuarioEstaLogado = false;
          window.location.reload();
        }
      }
    }, 3000);

    this.router.events.subscribe((e) => {
      this.usuarioEstaLogado = this.authService.isAuthenticated();
      if (e instanceof NavigationStart) {
        this.authService.registrarRequisicaoUsuario();
        this.paginaAnterior = e.url;
      }
      if (e instanceof NavigationEnd) {
        this.seoService.atualizarPagina(e.urlAfterRedirects).subscribe();
        gtag('config', 'G-QFNVQ95S48', {page_path: e.urlAfterRedirects });
      }
    });
  }

  sessaoExpirada() {
    if (this.authService.isAuthenticated()) {
      let tempoExpiracaoToken = this.authService.getSecondsToSessionExpiration();
      let tempoDesdeUltimaRequisicao = this.authService.getTempoDesdeUltimaRequisicao();

      // if (tempoExpiracaoToken <= 60 && tempoDesdeUltimaRequisicao <= (this.tempoSessao)) {
      //   this.authService.logout();

      //   this.authService.doRefresh(this.authService.refreshToken).subscribe((response) => {
      //     this.authService.guardarUsuario(response.access_token);
      //     this.authService.guardarToken(response.access_token);
      //     this.authService.guardarRefreshToken(response.refresh_token);

      //     tempoExpiracaoToken = this.authService.getSecondsToSessionExpiration();
      //     tempoDesdeUltimaRequisicao = this.authService.getTempoDesdeUltimaRequisicao();
      //   });
      // }

      if (tempoDesdeUltimaRequisicao >= this.tempoSessao) {
        this.authService.logout();

        PcsUtil.swal().fire({
          title: 'Sessão Expirada',
          text: `Sua sessão expirou!`,
          type: 'info',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      }

      if (tempoExpiracaoToken <= 0) {
        this.authService.logout();

        PcsUtil.swal().fire({
          title: 'Sessão Expirada',
          text: `Sua sessão expirou!`,
          type: 'info',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      }
    }
  }
}
