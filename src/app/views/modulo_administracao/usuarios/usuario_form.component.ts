import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Perfil } from 'src/app/model/perfil';
import { PerfisService } from 'src/app/services/perfis.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { CadastroCidadaoService } from 'src/app/services/cadastro-cidadao.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-form",
  templateUrl: "./usuario_form.component.html",
  styleUrls: ["./usuario_form.component.css"]
})
export class UsuarioFormComponent implements OnInit {
  visualizacao = false;
  tipoInstituicao = false;
  usuario: Usuario = new Usuario();
  perfisCombo: Perfil[] = [];
  usuarioForm: FormGroup;
  representaGestor = false;
  listaIntituicoes: any[] = [];
  loading = false;
  emailJaCadastrado = false;
  public mascara: string;
  scrollUp: any;

  constructor(
    private usuarioService: UsuarioService,
    private perfisService: PerfisService,
    private router: Router,
    private element: ElementRef,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public serviceCidadao: CadastroCidadaoService,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.usuarioForm = this.formBuilder.group({
      nome: ["", Validators.required],
      telefone: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
        ]
      ],
      visualizacao: [""],
      perfil: ["", Validators.required],
      nomeOrg: [""],
      tipoInstituicao: [""]
    });
    this.titleService.setTitle(`Formulário de Usuário - Cidades Sustentáveis`);
  }

  ngOnInit() {
    if (this.activatedRoute.toString().indexOf("visualizar/") !== -1) {
      this.visualizacao = true;
      this.tipoInstituicao = true;
      this.dadosEditar();
    }
    this.buscarUsuario();
    this.carregarComboPerfis();
    this.defineMascaraTelefone();
  }

  verificarEmail(email) {
    const dadosCadastrados = JSON.parse(
      localStorage.getItem("dadosCadastrados")
    ).content;
    const verifica = dadosCadastrados.filter(x => x.email === email);
    if (verifica.length > 0) {
      this.emailJaCadastrado = true;
    } else {
      this.emailJaCadastrado = false;
    }
  }

  instituicoes() {
    this.serviceCidadao.buscaIntituicoes().subscribe(dados => {
      this.listaIntituicoes = dados;
    });
  }

  representaGestorPlataforma(value) {
    if (value.nome === "Gestor de Desenvolvimento da Plataforma") {
      this.representaGestor = true;
      this.adicionaRequired();
      this.instituicoes();
    } else {
      this.representaGestor = false;
      this.removeRequired();
    }
  }

  defineMascaraTelefone() {
    if (
      this.usuarioForm.controls.telefone.value.replace("/[^0-9]/g", "").length >
      10
    ) {
      this.mascara = "(00) 0 0000-0000";
    } else {
      this.mascara = "(00) 0000-0000";
    }
  }

  adicionaRequired() {
    this.usuarioForm.controls.nomeOrg.setValidators([Validators.required]);
    this.usuarioForm.controls.nomeOrg.updateValueAndValidity();
    this.usuarioForm.controls.tipoInstituicao.setValidators([
      Validators.required
    ]);
    this.usuarioForm.controls.tipoInstituicao.updateValueAndValidity();
  }

  removeRequired() {
    this.usuarioForm.controls.nomeOrg.setValidators([]);
    this.usuarioForm.controls.nomeOrg.updateValueAndValidity();
    this.usuarioForm.controls.tipoInstituicao.setValidators([]);
    this.usuarioForm.controls.tipoInstituicao.updateValueAndValidity();
  }

  getErrorEmail() {
    return this.usuarioForm.get("email").hasError("required")
      ? "E-mail é obrigatório"
      : this.usuarioForm.get("email").hasError("pattern")
      ? "E-mail informado está fora do padrão"
      : "";
  }

  getErrorTelefone() {
    return this.usuarioForm.get("telefone").hasError("required")
      ? "Telefone é obrigatório"
      : "";
  }

  getErrorNome() {
    return this.usuarioForm.get("nome").hasError("required")
      ? "Nome é obrigatório"
      : "";
  }

  enableSalvar(): boolean {
    if (this.usuarioForm.valid === true) {
      return false;
    } else {
      return true;
    }
  }

  async dadosEditar() {
    let dadosPerfil = "";
    let i = 1;

    const obj = JSON.parse(localStorage.getItem("editar-obj"));

    this.usuarioForm.controls.nome.setValue(obj.nome);
    this.usuarioForm.controls.telefone.setValue(obj.telefone);
    this.usuarioForm.controls.email.setValue(obj.email);

    dadosPerfil = obj.nomePerfil;
    this.usuarioForm.controls.visualizacao.setValue(dadosPerfil);
  
    if (dadosPerfil.includes('Gestor de Desenvolvimento da Plataforma')) {
      this.representaGestor = true;
      this.usuarioForm.controls.nomeOrg.setValue(obj.organizacao);
      this.usuarioForm.controls.tipoInstituicao.setValue(obj.tipoInstituicao);
    }

  }

  private buscarUsuario(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.usuarioService.buscarUsuario(id).subscribe(usuario => {
          this.usuario = usuario;
          this.titleService.setTitle(`Detalhes do Usuário - ${this.usuario.nome} - Cidades Sustentáveis`);
        });
      }
    });
  }

  async cadastrar() {
    this.usuario.nome = this.usuarioForm.controls.nome.value;
    this.usuario.telefone = this.usuarioForm.controls.telefone.value;
    this.usuario.email = this.usuarioForm.controls.email.value;
    this.usuario.credencial.listaPerfil[0] = this.usuarioForm.controls[
      "perfil"
    ].value;
    if (this.representaGestor) {
      this.usuario.organizacao = this.usuarioForm.controls.nomeOrg.value;
      this.usuario.tipoInstituicao = this.usuarioForm.controls.tipoInstituicao.value;
    }
    this.usuarioService.existe(this.usuario.email).subscribe(response => {
      const valor = response;
      if (!valor) {
        this.usuarioService
          .inserirGestorPlataforma(this.usuario)
          .subscribe(response => {
            PcsUtil.swal()
              .fire(
                "Usuários",
                `Usuário ${this.usuario.nome} cadastrado!`,
                "success"
              )
              .then(res => {
                this.router.navigate(["/usuarios"]);
              });
          });
      } else {
        PcsUtil.swal().fire(
          "Usuários",
          `Já existe usuário cadastrado com o e-mail: ${this.usuario.email}!`,
          "error"
        );
      }
    });
  }

  public carregarComboPerfis(): void {
    this.perfisService.buscarPerfis().subscribe(perfis => {
      this.perfisCombo = perfis;
      this.perfisCombo = this.perfisCombo.filter(function(value, index, arr) {
        return (
          value.nome === "Administrador" ||
          value.nome === "Gestor de Desenvolvimento da Plataforma"
        );
      });
    });
  }

  public compararPerfil(p1: Perfil, p2: Perfil): boolean {
    if (p1 === undefined && p2 === undefined) {
      return true;
    }
    return p1 === null || p2 === null || p1 === undefined || p2 === undefined
      ? false
      : p1.id === p2.id;
  }
}
