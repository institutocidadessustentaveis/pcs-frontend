import { Label } from 'ng2-charts';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { CidadeService } from 'src/app/services/cidade.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { CadastroCidadaoService } from 'src/app/services/cadastro-cidadao.service';
import swal from 'sweetalert2';
import { Perfil } from 'src/app/model/perfil';
import { environment } from 'src/environments/environment';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { UsuarioCadastro } from 'src/app/model/usuario_cadastro';
import { ReCaptcha2Component } from 'ngx-captcha';
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
  selector: 'app-cadastro-cidadao',
  templateUrl: './cadastro-cidadao.component.html',
  styleUrls: ['./cadastro-cidadao.component.css']
})
export class CadastroCidadaoComponent implements OnInit {

  formulario: FormGroup;
  representaOrg = false;
  siteKey = '6LdtHrIUAAAAAHbWoQPwJCusVNVAer7Vo22rYT-u';
  loading = false;
  senhasCombinam = true;
  listaAreaInteresse: any[] = [];
  listaAreaAtuacoes: any[] = [];
  listaIntituicoes: any[] = [];
  options: ItemCombo[] = [];
  filteredOptions: Observable<ItemCombo[]>;
  checkCidadeAutoComplete = false;
  idCidadeSelecionado = null;
  nomeCidadeSelecionada = null;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  scrollUp: any;

  constructor(public formBuilder: FormBuilder,
              public serviceCidadao: CadastroCidadaoService,
              private areaInteresseService: AreaInteresseService,
              public router: Router, private element: ElementRef,
              private serviceCidade: CidadeService,
              private titleService: Title,) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      celular: ['', Validators.required],
      senha: [
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/)
        ]
      ],
      confirmaSenha: [
        "",
        [
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}/),
          passwordMatchValidator("senha")
        ]
      ],
      cidadeInteresse: ['', Validators.required],
      areasInteresse: [[], Validators.required],
      nomeOrg: [''],
      cargo: [''],
      areasAtuacao: [[], Validators.required],
      tipoInstituicao: [''],
      recaptcha: ['', Validators.required],
      representa: ['', Validators.required],
      recebeEmail: ['']
    });
    this.titleService.setTitle("Cadastro Cidadão - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.areasInteresses();
    this.cidadeInteresse();
    if (environment.production) {
      this.formulario.controls.recaptcha.setValidators([]);
      this.formulario.controls.recaptcha.updateValueAndValidity();
    } else {
      this.formulario.controls.recaptcha.setValidators([Validators.required]);
      this.formulario.controls.recaptcha.updateValueAndValidity();
    }
    this.filteredOptions = this.formulario.get('cidadeInteresse')!.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  private _filter(value: string): ItemCombo[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  msgAjuda() {
    PcsUtil.swal().fire({
      // tslint:disable-next-line: max-line-length
      html: 'Você pode cadastrar-se como cidadão ou representante de uma instituição.<br />Caso cadastre-se como representante, poderá ainda fazer um cadastro como cidadão para uso individual.',
      type: 'question',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
    }, error => { });
  }

  checkCidade() {
    if (this.options.filter(x => x.label.toLowerCase().trim() === this.formulario.get('cidadeInteresse').value.toLowerCase().trim()).length > 0) {
      this.checkCidadeAutoComplete = false;
    } else {
      this.checkCidadeAutoComplete = true;
      this.formulario.get('cidadeInteresse').setValue('');
    }
  }

  alerta(titulo, tipo) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: titulo,
      type: tipo,
      reverseButtons: true
    });
  }

  confirmacaoCadastro() {
    PcsUtil.swal().fire({
      title: 'Cadastro',
      text: `Você será representante de instituição. Deseja continuar?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.cadastrar();
      }
    }, error => { });
  }

  areasInteresses() {
    this.areaInteresseService.buscaAreasInteresses().subscribe((dados) => {
      this.listaAreaInteresse = dados;
    });
  }

  cidadeInteresse() {
    this.serviceCidade.buscarCidadeComboBox().subscribe(dados => {
      this.options = dados as ItemCombo[];
      this.filteredOptions = this.formulario.get('cidadeInteresse')!.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filter(label) : this.options.slice())
      );
    });
  }

  areaAtuacoes() {
    this.serviceCidadao.buscaAreaAtuacoes().subscribe((dados) => {
      this.listaAreaAtuacoes = dados;
    });
  }

  instituicoes() {
    this.serviceCidadao.buscaIntituicoes().subscribe((dados) => {
      this.listaIntituicoes = dados;
    });
  }

  representaOrganizacao(value) {
    if (value === 'true') {
      this.representaOrg = true;
      this.adicionaRequired();
      this.areaAtuacoes();
      this.instituicoes();
    } else {
      this.representaOrg = false;
      this.removeRequired();
    }
  }

  adicionaRequired() {
    this.formulario.controls.nomeOrg.setValidators([Validators.required]);
    this.formulario.controls.nomeOrg.updateValueAndValidity();
    this.formulario.controls.cargo.setValidators([Validators.required]);
    this.formulario.controls.cargo.updateValueAndValidity();
    this.formulario.controls.tipoInstituicao.setValidators([Validators.required]);
    this.formulario.controls.tipoInstituicao.updateValueAndValidity();
    this.formulario.controls.areasAtuacao.setValidators([Validators.required]);
    this.formulario.controls.areasAtuacao.updateValueAndValidity();
  }

  removeRequired() {
    this.formulario.controls.nomeOrg.setValidators([]);
    this.formulario.controls.nomeOrg.updateValueAndValidity();
    this.formulario.controls.cargo.setValidators([]);
    this.formulario.controls.cargo.updateValueAndValidity();
    this.formulario.controls.tipoInstituicao.setValidators([]);
    this.formulario.controls.tipoInstituicao.updateValueAndValidity();
    this.formulario.controls.areasAtuacao.setValidators([]);
    this.formulario.controls.areasAtuacao.updateValueAndValidity();
  }

  cadastrar() {
    const usuario = new UsuarioCadastro();
    usuario.nome = this.formulario.controls.nome.value;
    usuario.email = this.formulario.controls.email.value;
    usuario.areasInteresse = this.formulario.controls.areasInteresse.value;
    usuario.telefone = this.formulario.controls.celular.value;
    usuario.credencial.login = this.formulario.controls.email.value;
    usuario.credencial.senha = this.formulario.controls.senha.value;
    const perfil = new Perfil();
    perfil.id = 2;
    usuario.credencial.listaPerfil[0] = perfil;
    usuario.cidadeInteresse = this.idCidadeSelecionado;
    if (this.formulario.controls.recebeEmail.value != null) {
      usuario.recebeEmail = this.formulario.controls.recebeEmail.value;
    } else {
      usuario.recebeEmail = false;
    }
    if (this.representaOrg) {
      usuario.organizacao = this.formulario.controls.nomeOrg.value;
      usuario.cargo = this.formulario.controls.cargo.value;
      usuario.areasAtuacoes = this.formulario.controls.areasAtuacao.value;
      usuario.tipoInstituicao = this.formulario.controls.tipoInstituicao.value;
      perfil.id = 3;
      usuario.credencial.listaPerfil[0] = perfil;
    }
    usuario.tokenRecaptcha = this.formulario.controls.recaptcha.value;

    this.serviceCidadao.inserir(usuario).subscribe((retorno) => {
      this.loading = true;
      PcsUtil.swal().fire({
        title: 'Sucesso',
        text: `Cadastro realizado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/']);
      }, error => { });
    }, (error) => {
      this.loading = false;
      this.captchaElem.resetCaptcha();
    });
  }

  async gravar() {
    if (this.representaOrg) {
      await this.confirmacaoCadastro();
    } else {
      await this.cadastrar();
    }
  }

  handleSuccess(evento) {
    this.formulario.controls.recaptcha.setValue(evento);
  }

  comparaSenha() {
    if (this.formulario.controls.confirmaSenha.value === this.formulario.controls.senha.value) {
      this.senhasCombinam = true;
    } else {
      this.senhasCombinam = false;
    }
  }

  public getTextoExibicaoCidade(cidade?: ItemCombo): string | undefined {
    return cidade ? cidade.label : undefined;

  }

  setCidadeSelecionada(cidade: ItemCombo) {
      this.idCidadeSelecionado = cidade.id;
      this.nomeCidadeSelecionada = cidade.label;
  }

  getErrorSenha() {
    return this.formulario.get("senha").hasError("required")
      ? "Campo senha é obrigatório"
      : this.formulario.get("senha").hasError("minlength")
      ? "A senha deve conter ao menos 6 dígitos"
      : this.formulario.get("senha").hasError("maxlength")
      ? "A senha deve conter no máximo 10 dígitos"
      : this.formulario.get("senha").hasError("pattern")
      ? "A senha está fora do padrão solicitado pelo sistema"
      : "";
  }

  getErrorConfirmaSenha() {
    return this.formulario.get("confirmaSenha").hasError("required")
      ? "Campo senha é obrigatório"
      : this.formulario.get("confirmaSenha").hasError("minlength")
      ? "A senha deve conter ao menos 6 dígitos"
      : this.formulario.get("confirmaSenha").hasError("maxlength")
      ? "A senha deve conter no máximo 10 dígitos"
      : this.formulario.get("confirmaSenha").hasError("pattern")
      ? "A senha está fora do padrão solicitado pelo sistema"
      : this.formulario.get("confirmaSenha").hasError("mismatch")
      ? "A senha e a confirmação de senha não conferem"
      : "";
  }
}
