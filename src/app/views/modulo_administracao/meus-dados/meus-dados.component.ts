import { UsuarioService } from 'src/app/services/usuario.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastroCidadaoService } from 'src/app/services/cadastro-cidadao.service';
import { Perfil } from 'src/app/model/perfil';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ngx-captcha';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { switchAll, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.css']
})
export class MeusDadosComponent implements OnInit {

  public usuario: Usuario;
  public perfisDoUsuario: string[] = [];
  formulario: FormGroup;
  representaOrg = false;
  loading = false;

  listaAreaInteresse: any[] = [];
  listaAreaAtuacoes: any[] = [];
  listaIntituicoes: any[] = [];

  listaAreaInteresseUsuario: any[] = [];
  listaAreaAtuacaoUsuario: any[] = [];

  checkCidadeAutoComplete = false;
  filteredOptions: Observable<Array<{id: string, label: string}>>;
  options: Array<{id: string, label: string}> = [];

  usuarioLogado: any = JSON.parse(localStorage.getItem('usuarioLogado'));
  scrollUp: any;

  constructor(public formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              public serviceCidadao: CadastroCidadaoService,
              private usuarioService: UsuarioService,
              private areaInteresseService: AreaInteresseService,
              private router: Router,
              private element: ElementRef,
              public authService: AuthService,
              private titleService: Title,) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      telefone_fixo: [''],
      telefone: ['', Validators.required],
      cidadeInteresse: [''],
      areasInteresse: [''],
      nomeOrg: ['', Validators.required],
      cargo: ['', Validators.required],
      areasAtuacao: [''],
      tipoInstituicao: ['', Validators.required],
      representa: ['']
    });
    this.titleService.setTitle("Meus Dados - Cidades Sustentáveis");
  }

  ngOnInit() {
    this.carregarAreasInteresses();
    this.cidadeInteresse();
    this.carregarUsuario();
  }

  private _filter(value: string): Array<{id: string, label: string}> {
    if (value && typeof value == "string") {
      const filterValue = value;
      return this.options.filter(option => option.label.toLowerCase().includes(filterValue.toLowerCase()));
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
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Aviso',
      text: `Você está criando um cadastro de instituição cujo usuário representante será você. Deseja continuar?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.cadastrar();
      }
    });
  }

  adicionarAreaInteresse() {
    const consulta = this.listaAreaInteresse.find(x => x.id === this.formulario.controls.areasInteresse.value);

    // Verifica se o item ja tem na lista
    if (this.listaAreaInteresseUsuario.length > 0) {
      const listaAtual = this.listaAreaInteresseUsuario.find(x => x.id === this.formulario.controls.areasInteresse.value);
      if (listaAtual !== undefined) {
        this.alerta('Área de Interesse já inserida.', 'warning');
      } else {
        this.listaAreaInteresseUsuario.push(consulta);
      }
    } else {
      this.listaAreaInteresseUsuario.push(consulta);
    }

    this.formulario.controls.areasInteresse.setValue('');
  }

  adicionarAreaAtuacao() {
    const consulta = this.listaAreaAtuacoes.find(x => x.id === this.formulario.controls.areasAtuacao.value);

    // Verifica se o item ja tem na lista
    if (this.listaAreaAtuacaoUsuario.length > 0) {
      const listaAtual = this.listaAreaAtuacaoUsuario.find(x => x.id === this.formulario.controls.areasAtuacao.value);
      if (listaAtual !== undefined) {
        this.alerta('Área de Atuação já inserida.', 'warning');
      } else {
        this.listaAreaAtuacaoUsuario.push(consulta);
      }
    } else {
      this.listaAreaAtuacaoUsuario.push(consulta);
    }

    this.formulario.controls.areasAtuacao.setValue('');
  }

  removeAreaInteresse(area) {
    this.listaAreaInteresseUsuario.forEach((item, index) => {
      if (item === area) { this.listaAreaInteresseUsuario.splice(index, 1); }
    });
  }

  removeAreaAtuacao(area) {
    this.listaAreaAtuacaoUsuario.forEach((item, index) => {
      if (item === area) { this.listaAreaAtuacaoUsuario.splice(index, 1); }
    });
  }

  carregarAreasInteresses() {
    this.areaInteresseService.buscaAreasInteresses().subscribe((dados) => {
      this.listaAreaInteresse = dados;
    });
  }

  carregarAreaAtuacoes() {
    this.serviceCidadao.buscaAreaAtuacoes().subscribe((dados) => {
      this.listaAreaAtuacoes = dados;
    });
  }

  carregarInstituicoes() {
    this.serviceCidadao.buscaIntituicoes().subscribe((dados) => {
      this.listaIntituicoes = dados;
    });
  }

  cadastrar() {
    this.loading = true;
    this.usuario.nome = this.formulario.controls.nome.value;
    this.usuario.telefone_fixo = this.formulario.controls.telefone_fixo.value;
    this.usuario.telefone = this.formulario.controls.telefone.value;
    if(this.options.filter(x => x.id != null && x.id == this.formulario.get('cidadeInteresse').value).length > 0){
      this.usuario.cidadeInteresse = this.formulario.controls.cidadeInteresse.value;
    }else{
      this.usuario.cidadeInteresse = "";
    }
    this.usuario.areasInteresse = this.listaAreaInteresseUsuario;
    if (this.representaOrg) {
      this.usuario.organizacao = this.formulario.controls.nomeOrg.value;
      this.usuario.cargo = this.formulario.controls.cargo.value;
      this.usuario.areasAtuacoes = this.listaAreaAtuacaoUsuario;
      this.usuario.tipoInstituicao = this.formulario.controls.tipoInstituicao.value;
    }

    this.usuarioService.editarUsuarioLogado(this.usuario).subscribe((retorno) => {
      this.formulario.reset();
      this.listaAreaInteresseUsuario = [];
      this.listaAreaAtuacaoUsuario = [];
      this.loading = false;
      this.formulario.controls.areasInteresse.setValue('');
      this.formulario.controls.areasAtuacao.setValue('');
      this.router.navigate([`/institucional`]);
      this.alerta('Dados salvos.', 'success');
    }, (error) => {
      this.loading = false;
    });
  }

  async salvar() {
    await this.cadastrar();
  }

  public carregarUsuario() {

    this.activatedRoute.params.subscribe(params => {
      const idUsuarioLogado = this.authService.credencial.id;
      if (idUsuarioLogado != params.id) {
        this.router.navigate([`/institucional`]);
        swal.fire('Sem permissão', 'Você não possui permissão para editar os dados do usuário solicitado!', 'warning');
      } else {
        this.usuarioService.buscarUsuarioLogado().subscribe(response => {
          this.perfisDoUsuario = response.nomePerfil.split(' | ');
          this.usuario = response;
          this.formulario.controls.nome.setValue(response.nome);
          this.formulario.controls.email.setValue(response.email);
          this.formulario.controls.telefone.setValue(response.telefone);
          this.formulario.controls.telefone_fixo.setValue(response.telefone_fixo);
          this.formulario.controls.cidadeInteresse.setValue(response.cidadeInteresse);
          this.listaAreaInteresseUsuario = response.areasInteresse;

          /*Se representa uma organização*/
          if (response.organizacao != null) {
            this.representaOrg = true;
            this.formulario.controls.representa.setValue(true);
            this.carregarInstituicoes();
            this.carregarAreaAtuacoes();
            this.formulario.controls.nomeOrg.setValue(response.organizacao);
            this.formulario.controls.cargo.setValue(response.cargo);
            this.listaAreaAtuacaoUsuario = response.areasAtuacoes;
            this.formulario.controls.tipoInstituicao.setValue(response.tipoInstituicao);
          }
          this.removeRequired();
        });
      }
    });
  }

  checkCidade() {
    if (this.options.filter(x => x.id != null && x.id == this.formulario.get('cidadeInteresse').value).length > 0) {
      this.checkCidadeAutoComplete = false;
    }
    else {
      this.checkCidadeAutoComplete = true;
      this.formulario.get('cidadeInteresse').setValue('');
    }
  }

  

  cidadeInteresse() {
    this.serviceCidadao.buscaCidadeInteresse().subscribe((dados) => {
      this.options = JSON.parse(JSON.stringify(dados));
      this.filteredOptions = this.formulario.get('cidadeInteresse')!.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    });
  }

  getLabel(cidadeId: string){
    if(this.options.find(x => x.id == cidadeId) !=null && this.options.find(x => x.id == cidadeId) != undefined){
      return this.options.find(x => x.id == cidadeId).label;
    }else{
      return "";
    }
    }

  removeRequired() {

    /*Se for administrador*/
    if (this.usuarioLogado.listaPerfil != null && this.usuarioLogado.listaPerfil.length > 0 && this.usuarioLogado.listaPerfil[0].id == 1) {
      this.formulario.controls.cidadeInteresse.setValidators([]);
      this.formulario.controls.cidadeInteresse.updateValueAndValidity();
    }

    /*Se não representa uma instituição*/
    if (!this.representaOrg) {
      this.formulario.controls.cargo.setValidators([]);
      this.formulario.controls.cargo.updateValueAndValidity();
      this.formulario.controls.tipoInstituicao.setValidators([]);
      this.formulario.controls.tipoInstituicao.updateValueAndValidity();
      this.formulario.controls.nomeOrg.setValidators([]);
      this.formulario.controls.nomeOrg.updateValueAndValidity();
      this.formulario.controls.areasAtuacao.setValidators([]);
      this.formulario.controls.areasAtuacao.updateValueAndValidity();
    }
  }
}
