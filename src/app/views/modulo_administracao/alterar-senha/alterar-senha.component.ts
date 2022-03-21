
import { AlterarSenha } from '../../../model/alterarSenha';
import { Component, OnInit, ElementRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Title } from '@angular/platform-browser';

export function passwordMatchValidator(novaSenha: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(novaSenha).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent implements OnInit {
  hideConfirmarSenha: boolean;
  hideNovaSenha: boolean;
  hideSenhaAtual: boolean;
  alterarSenhaForm: FormGroup;
  scrollUp: any;


  constructor(public usuarioService: UsuarioService,
              public router: Router,
              private element: ElementRef,
              public formBuilder: FormBuilder,
              public activatedRoute: ActivatedRoute,
              private titleService: Title,) {
    this.titleService.setTitle("Alterar Senha - Cidades Sustentáveis");
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });
    this.alterarSenhaForm = this.formBuilder.group({
      senhaAtual: ['', [
        Validators.required,
      ]],
      novaSenha: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][0-9a-zA-Z.!&@$%/()=?+*~#'_:.,;-]{6,10}/)
      ]],
      confirmarNovaSenha: ['', [
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][0-9a-zA-Z.!&@$%/()=?+*~#'_:.,;-]{6,10}/),
        passwordMatchValidator('novaSenha')
      ]]
    });
  }


  alterarSenha: AlterarSenha = new AlterarSenha();
  senha: string;
  novaSenha: string;
  confirmarNovaSenha: string;
  validacaoSenha = false;

  ngOnInit() {
    this.hideSenhaAtual = true;
    this.hideNovaSenha = true;
    this.hideConfirmarSenha = true;
  }

  getErrorNovaSenha() {
    return this.alterarSenhaForm.get('novaSenha').hasError('required') ? 'Campo nova senha é obrigatório' :
      this.alterarSenhaForm.get('novaSenha').hasError('maxlength') ? 'A senha deve conter no máximo 10 dígitos' :
        this.alterarSenhaForm.get('novaSenha').hasError('pattern') ? 'A senha deve conter letra(s) , numero(s) e caracteres especiais' : '';
  }

  getErrorConfirmarSenha() {
    return this.alterarSenhaForm.get('confirmarNovaSenha').hasError('required') ? 'Campo confirmar nova senha é obrigatório' :
      this.alterarSenhaForm.get('confirmarNovaSenha').hasError('minlength') ? 'A senha deve conter ao menos 6 dígitos' :
        this.alterarSenhaForm.get('confirmarNovaSenha').hasError('maxlength') ? 'A senha deve conter no máximo 10 dígitos' :
          this.alterarSenhaForm.get('confirmarNovaSenha').hasError('pattern') ? 'A senha está fora do padrão solicitado pelo sistema' :
            this.alterarSenhaForm.get('confirmarNovaSenha').hasError('mismatch') ? 'Confirmar senha não confere com a nova senha' : '';
  }

  enableSalvar(): Boolean {
    if (this.alterarSenhaForm.valid === true) {
      return false;
    } else {
      return true;
    }
  }

  async cadastrarNovaSenha() {
    this.alterarSenha.senha = this.alterarSenhaForm.controls["senhaAtual"].value;
    this.alterarSenha.novaSenha = this.alterarSenhaForm.controls["novaSenha"].value;
    this.alterarSenha.confirmarNovaSenha = this.alterarSenhaForm.controls["confirmarNovaSenha"].value;
    await this.usuarioService.alterarSenha(this.alterarSenha).subscribe(async response => {
      PcsUtil.swal().fire({
        title: 'Nova Senha',
        text: `Senha cadastrada com sucesso!`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/institucional']);
      }, error => { });
    });
  }
}
