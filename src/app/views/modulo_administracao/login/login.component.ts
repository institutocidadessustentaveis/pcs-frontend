import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Credencial } from 'src/app/model/credencial';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { inject } from '@angular/core/testing';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PerfisService } from 'src/app/services/perfis.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { Prefeitura } from 'src/app/model/prefeitura';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { WebSocketEchoService } from 'src/app/services/web-socket-echo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Login";
  credencial: Credencial;
  loading: any;
  formlogin: FormGroup;
  innerWidth: any;
  usuarioPrefeitura: boolean;
  dadosPrefeitura: Prefeitura = new Prefeitura();
  labelSistema: string = "Carregando configurações do sistema...";
  hideSenha: boolean;
  scrollUp: any;

  constructor(public authService: AuthService,
              public router: Router,
              private element: ElementRef,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public perfisService: PerfisService,
              public usuarioService: UsuarioService,
              private alertaService: AlertaService,
              public prefeituraService: PrefeituraService,
              public wsEcho: WebSocketEchoService) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });
    this.credencial = new Credencial();
    this.formlogin = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      senha: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicial/home']);
    }

    setInterval(() => {
      if (this.authService.isAuthenticated() && window.location.pathname == '/login' ) {
        this.router.navigate(['/inicial/home']);
      }
    }, 3000);

    this.hideSenha = true;
    this.innerWidth = window.innerWidth;
  }

  doLogin() {
    if (!this.loading) {
      this.loading = true;

      this.credencial.login = this.formlogin.controls['usuario'].value;
      this.credencial.senha = this.formlogin.controls['senha'].value;

      this.authService.doLogin(this.credencial).subscribe(response => {
          this.authService.guardarUsuario(response.access_token);
          this.authService.guardarToken(response.access_token);
          this.authService.guardarRefreshToken(response.refresh_token);
          this.getTipoUsuario(this.authService.credencial.login);
          let usuarioLogado = this.authService.credencial;
          this.loading = false;
          this.router.navigate(['/inicial/home']);
          if (this.authService.isAuthenticated() && this.authService.hasRole('ROLE_VISUALIZAR_ALERTA')) {
            this.alertaService.getQuantidade().subscribe(res => { this.alertaService.qtdNovos = res as number; });
          }
        },
        error => {
          if (error.status == 400) {
            PcsUtil.swal().fire({
              title: 'Sessão finalizada',
              text: `Usuário ou senha incorretos!`,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            }).then((result) => {
              this.loading = false;
            }, error => { this.loading = false; });
          }

          if (error.status === 401) {
            PcsUtil.swal().fire({
              title: 'Sessão finalizada',
              text: `Erro durante a autenticação`,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            }).then((result) => {
              this.loading = false;
            }, error => { this.loading = false; });
          }
          console.error(error);
          this.loading = false;
        }
      );
    }
  }

  async ListaPerfil() {
    this.perfisService.buscarPerfilAtivo().subscribe(response => {
      let usuarioLogadoCredencial = JSON.parse(localStorage.getItem('usuarioLogado'));
      usuarioLogadoCredencial.listaPerfil = response;
      usuarioLogadoCredencial.usuarioPrefeitura = Boolean(this.usuarioPrefeitura);
      usuarioLogadoCredencial.dadosPrefeitura = this.dadosPrefeitura;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogadoCredencial));
      this.authService.setUsuarioPrefeitura();
    });
  }

  async getTipoUsuario(Email: string) {
    this.usuarioService.buscarPorEmail(Email).subscribe(response => {
      if (response.prefeitura.id !== null) {
        this.usuarioPrefeitura = true;
        this.prefeituraService.buscarLogin(response.prefeitura.id).subscribe(response => {
          this.dadosPrefeitura = response;
          this.ListaPerfil();
        })
      } else {
        this.ListaPerfil();
      }
    });
  }

  openModalCadastroEsqueciSenha(innerWidth): void {
    if (innerWidth > 500) {
      const dialogCadastroEsqueciSenha = this.dialog.open(DialogEsqueciSenha, {
        height: 'auto',
        width: '50%',
      });

      dialogCadastroEsqueciSenha.afterClosed().subscribe(result => {
      });
    } else {
      const dialogCadastroEsqueciSenha = this.dialog.open(DialogEsqueciSenha, {

      });
      dialogCadastroEsqueciSenha.afterClosed().subscribe(result => {
      });
    }
  }


  getUsuario() {
    return this.formlogin.get('usuario').hasError('required') ? 'Campo usuario é obrigatório' :
      this.formlogin.get('usuario').hasError('minlength') ? 'Campo usuario deve conter ao menos 10 dígitos' :
        this.formlogin.get('usuario').hasError('maxlength') ? 'Campo usuario deve conter no máximo 40 dígitos' :
          this.formlogin.get('usuario').hasError('pattern') ? 'O usuario digitado não está no formato correto' : '';
  }

  getSenha() {
    return this.formlogin.get('senha').hasError('required') ? 'Campo senha é obrigatório' :
      this.formlogin.get('senha').hasError('minlength') ? 'Campo senha deve conter ao menos 3 dígitos' :
        this.formlogin.get('senha').hasError('maxlength') ? 'Campo senha deve conter no máximo 10 dígitos' : '';
  }
}

@Component({
  selector: 'esquecisenha',
  templateUrl: './esquecisenha.html',
  styleUrls: ['./login.component.css']
})
export class DialogEsqueciSenha {
  loading = false;
  formEsqueciSenha: FormGroup;

  constructor(public usuarioService: UsuarioService, public dialogRef: MatDialogRef<DialogEsqueciSenha>,
    public formBuilder: FormBuilder) {
    this.formEsqueciSenha = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
    });
  }

  async enviar() {
    await this.usuarioService.esqueciSenha(this.formEsqueciSenha.controls['email'].value).subscribe(async response => {
      if (response === true) {
        await PcsUtil.swal().fire({
          title: 'Alteração de senha',
          text: `Solicitação de alteração de senha encaminhada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        }, error => { swal.fire('Erro', 'error'); });
      } else {
        await PcsUtil.swal().fire({
          title: 'Esqueci a senha',
          text: `O email ${this.formEsqueciSenha.controls['email'].value} não existe no sistema PCS`,
          type: 'info',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      }
    });
  }

  voltar(): void {
    this.dialogRef.close();
  }

  getEmail() {
    return this.formEsqueciSenha.get('email').hasError('required') ? 'Campo email é obrigatório' :
      this.formEsqueciSenha.get('email').hasError('minlength') ? 'Campo e-mail deve conter ao menos 10 dígitos' :
        this.formEsqueciSenha.get('email').hasError('maxlength') ? 'Campo e-mail deve conter no máximo 40 dígitos' :
          this.formEsqueciSenha.get('email').hasError('pattern') ? 'E-mail digitado não está no formato correto' : '';
  }
}
