import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AlterarSenha } from 'src/app/model/alterarSenha';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmailTokenService } from 'src/app/services/emailToken.service';
import { EmailToken } from 'src/app/model/emailToken';
import { Title } from '@angular/platform-browser';

export function passwordMatchValidator(SenhaAtual: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(SenhaAtual).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: "app-recupera-senha",
  templateUrl: "./recupera-senha.component.html",
  styleUrls: ["./recupera-senha.component.css"]
})
export class RecuperaSenhaComponent implements OnInit {
  formRecuperaSenha: FormGroup;
  checked: boolean;
  hideSenha: boolean;
  hideConfirmaSenha: boolean;
  loading: boolean;
  usuarioEmail: string;
  emailToken: EmailToken;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public usuarioService: UsuarioService,
    public emailTokenService: EmailTokenService,
    private element: ElementRef,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formRecuperaSenha = this.formBuilder.group({
      Senha: [
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/)
        ]
      ],
      ConfirmaSenha: [
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/),
          passwordMatchValidator("Senha")
        ]
      ]
    });
    this.titleService.setTitle("Recuperação de Senha - Cidades Sustentáveis");
  }

  ngOnInit() {
    this.loading = true;
    this.checked = false;
    this.hideSenha = true;
    this.hideConfirmaSenha = true;
    this.BuscarUsuario();
  }

  async BuscarUsuario() {
    const token: string = this.activatedRoute.snapshot.queryParams.token;

    if (token !== null && token !== undefined) {
      await this.emailTokenService.buscarByHash(token).subscribe(response => {
        this.emailToken = response as EmailToken;
        this.usuarioEmail = this.emailToken.usuario.email;
        this.loading = false;
      });
    } else {
      this.TokenExpirado();
    }
  }

  async TokenExpirado() {
    await PcsUtil.swal()
      .fire({
        title: "Recuperação de senha",
        text: `Token de acesso expirado.`,
        type: "error",
        showCancelButton: false,
        confirmButtonText: "Ok"
      })
      .then(
        result => {
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    this.router.navigate(["/login"]);
  }

  async salvar() {
    const criarSenha: AlterarSenha = new AlterarSenha();
    criarSenha.usuario = this.usuarioEmail;
    criarSenha.senha = this.formRecuperaSenha.controls.Senha.value;
    criarSenha.novaSenha = this.formRecuperaSenha.controls.ConfirmaSenha.value;
    await this.usuarioService
      .criarNovaSenha(criarSenha)
      .subscribe(async response => {
        await PcsUtil.swal()
          .fire({
            title: "Recuperação de senha",
            text: `Senha alterada!`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(
            result => {
              this.loading = false;
            },
            error => {
              this.loading = false;
            }
          );
        this.router.navigate(["/login"]);
      });
  }

  getErrorSenha() {
    return this.formRecuperaSenha.get("Senha").hasError("required")
      ? "Campo senha é obrigatório"
      : this.formRecuperaSenha.get("Senha").hasError("minlength")
      ? "A senha deve conter ao menos 6 dígitos"
      : this.formRecuperaSenha.get("Senha").hasError("maxlength")
      ? "A senha deve conter no máximo 10 dígitos"
      : this.formRecuperaSenha.get("Senha").hasError("pattern")
      ? "A senha está fora do padrão solicitado pelo sistema"
      : "";
  }

  getErrorConfirmaSenha() {
    return this.formRecuperaSenha.get("ConfirmaSenha").hasError("required")
      ? "Campo senha é obrigatório"
      : this.formRecuperaSenha.get("ConfirmaSenha").hasError("minlength")
      ? "A senha deve conter ao menos 6 dígitos"
      : this.formRecuperaSenha.get("ConfirmaSenha").hasError("maxlength")
      ? "A senha deve conter no máximo 10 dígitos"
      : this.formRecuperaSenha.get("ConfirmaSenha").hasError("pattern")
      ? "A senha está fora do padrão solicitado pelo sistema"
      : this.formRecuperaSenha.get("ConfirmaSenha").hasError("mismatch")
      ? "A senha e a confirmação de senha não conferem"
      : "";
  }
}
