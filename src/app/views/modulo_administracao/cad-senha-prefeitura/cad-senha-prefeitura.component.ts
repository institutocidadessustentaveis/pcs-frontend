import { Title } from '@angular/platform-browser';
import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AlterarSenha } from 'src/app/model/alterarSenha';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmailTokenService } from 'src/app/services/emailToken.service';
import { EmailToken } from 'src/app/model/emailToken';

export function passwordMatchValidator(SenhaAtual: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(SenhaAtual).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-cad-senha-prefeitura',
  templateUrl: './cad-senha-prefeitura.component.html',
  styleUrls: ['./cad-senha-prefeitura.component.css']
})
export class CadSenhaPrefeituraComponent implements OnInit {

  Termos: string;
  formCadSenha: FormGroup;
  checked: boolean;
  hideSenha: boolean;
  hideConfirmaSenha: boolean;
  loading: boolean;
  usuario: string;
  usuarioEmail: string;
  prefeitura: string;
  responsavel: string = '';

  emailToken: EmailToken;
  scrollUp: any;

  constructor(public authService: AuthService, public formBuilder: FormBuilder,
              public router: Router,
              private element: ElementRef,
              public activatedRoute: ActivatedRoute,
              public usuarioService: UsuarioService,
              public emailTokenService: EmailTokenService,
              private titleService: Title,) {
    this.scrollUp = this.router.events.subscribe((path) => {
         element.nativeElement.scrollIntoView();
    });
    this.formCadSenha = this.formBuilder.group({
      Senha: ['', [Validators.minLength(6),
                  Validators.maxLength(10),
                  Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/)]],
      ConfirmaSenha: ['', [Validators.minLength(6),
                            Validators.maxLength(10),
                            Validators.required,
                            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/),
                            passwordMatchValidator('Senha')]]
    });
    this.titleService.setTitle("Cadastro de Senha - Cidades Sustentáveis");
  }

  ngOnInit() {
    this.loading = true;
    this.checked = false;
    this.hideSenha = true;
    this.hideConfirmaSenha = true;
    this.BuscarUsuario();
    this.loading = false;
  }

  async BuscarUsuario() {
    const token: string = this.activatedRoute.snapshot.queryParams.token;
    let count = 1;

    if (token !== null && token !== undefined) {
      await this.emailTokenService.buscarByHash(token).subscribe(response => {
        this.emailToken = response as EmailToken;
        this.usuario = this.emailToken.usuario.nome;
        this.usuarioEmail = this.emailToken.usuario.email;
        this.prefeitura = this.emailToken.usuario.prefeitura.cidade.nome;
        this.emailToken.usuario.credencial.listaPerfil.forEach(perfil => {
          if (count !== this.emailToken.usuario.credencial.listaPerfil.length) {
            this.responsavel = this.responsavel + perfil.nome + ', ';
          } else {
            this.responsavel = this.responsavel + perfil.nome;
          }
          count++;
        });
      });
    } else {
      this.TokenExpirado();
    }
  }

  async TokenExpirado() {
    await PcsUtil.swal().fire({
      title: 'Cadastro de senha',
      text: `Token de acesso expirado.`,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then(() => {
      this.loading = false;
    }, () => { this.loading = false; });
    this.router.navigate(['/login']);
  }

  enableSalvar(): Boolean {
    if (this.formCadSenha.valid === true && this.checked === true) {
      return false;
    } else {
      return true;
    }
  }

  async salvar() {
    const dadosSenha: AlterarSenha = new AlterarSenha();
    dadosSenha.usuario = this.usuarioEmail;
    dadosSenha.senha = this.formCadSenha.controls.Senha.value;
    dadosSenha.novaSenha = this.formCadSenha.controls.ConfirmaSenha.value;
    await this.usuarioService.cadastrarSenha(dadosSenha).subscribe(async () => {
      await PcsUtil.swal().fire({
        title: 'Cadastro de senha',
        text: `Senha cadastrada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then(() => {
        this.loading = false;
      }, () => { this.loading = false; });
      this.router.navigate(['/login']);
    });
  }

  getErrorSenha() {
    return this.formCadSenha.get('Senha').hasError('required') ? 'Campo senha é obrigatório(Deve ter pelo menos 6 caracteres, contendo letra(s) e número(s))' :
      this.formCadSenha.get('Senha').hasError('minlength') ? 'A senha deve conter ao menos 6 dígitos' :
        this.formCadSenha.get('Senha').hasError('maxlength') ? 'A senha deve conter no máximo 10 dígitos' :
          this.formCadSenha.get('Senha').hasError('pattern') ? 'A senha está fora do padrão solicitado pelo sistema (Deve ter pelo menos 6 caracteres, contendo letra(s) e número(s))' : '';
  }

  getErrorConfirmaSenha() {
    return this.formCadSenha.get('ConfirmaSenha').hasError('required') ? 'Campo confirmação de senha é obrigatório (Deve ter pelo menos 6 caracteres, contendo letra(s) e número(s))' :
      this.formCadSenha.get('ConfirmaSenha').hasError('minlength') ? 'A confirmação de senha deve conter ao menos 6 dígitos' :
        this.formCadSenha.get('ConfirmaSenha').hasError('maxlength') ? 'A confirmação de senha deve conter no máximo 10 dígitos' :
          this.formCadSenha.get('ConfirmaSenha').hasError('pattern') ? 'A confirmação de senha está fora do padrão solicitado pelo sistema (Deve ter pelo menos 6 caracteres, contendo letra(s) e número(s))' :
            this.formCadSenha.get('ConfirmaSenha').hasError('mismatch') ? 'A senha e a confirmação de senha não conferem' : '';
  }
}
