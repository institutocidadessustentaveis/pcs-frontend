import { EmailTokenService } from '../../../services/emailToken.service';
import { Credencial } from 'src/app/model/credencial';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { AddReponsavelService } from 'src/app/services/add-responsavel.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { PerfisService } from 'src/app/services/perfis.service';
import { Perfil } from 'src/app/model/perfil';
import { IfStmt } from '@angular/compiler';
import { EmailToken } from 'src/app/model/emailToken';
import { Subscription } from 'rxjs';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Title } from '@angular/platform-browser';

export class ResponsavelPapeis {
  constructor(nome: string, papel: string, email: string, telefoneFixo: string, celular: string, cargo: string,
              listaPapelAtribuidosEditar: Perfil[] = [], recebeEmail: boolean) {
    this.nome = nome;
    this.email = email;
    this.papel = papel;
    this.telefoneFixo = telefoneFixo;
    this.cargo = cargo;
    this.celular = celular;
    this.listaPapelAtribuidosEditar = listaPapelAtribuidosEditar;
    this.recebeEmail = recebeEmail;
  }
  nome: string;
  email: string;
  celular: string;
  papel: string;
  telefoneFixo: string;
  cargo: string;
  listaPapelAtribuidosEditar: Perfil[] = [];
  recebeEmail: boolean;
}

@Component({
  selector: 'app-add-responsavel',
  templateUrl: './add-responsavel.component.html',
  styleUrls: ['./add-responsavel.component.css']
})
export class AddResponsavelComponent implements OnInit, OnDestroy {
  perfisCombo: Perfil[] = [];
  usuarioResponsavel: Usuario = new Usuario();
  addResponsavelForm: FormGroup;
  checked: boolean;
  Termos: string;
  TextTermos: string;
  responsavel: string;
  validarFormulario: boolean;
  papeisAdicionadosLista: any;
  numeroPapeis = 0;
  nomeResponsavel;
  emailToken: EmailToken;
  perfilPrefeitura: Perfil[] = [];
  listaPapeisAtribuidos: Perfil[] = [];
  // Lista de Usuarios (Responsaveis)
  listaResponsaveis: Usuario[] = [];

  // Lista de papeis da Tabela
  listaPapeisResponsavel: ResponsavelPapeis[] = [];
  dataSource = new MatTableDataSource<ResponsavelPapeis>();
  displayedColumns = ['Responsavel', 'Papeis', 'Ações'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private inscricao: Subscription;
  scrollUp: Subscription;

  constructor(public formBuilder: FormBuilder,
              public addResponsavelService: AddReponsavelService,
              public activatedRoute: ActivatedRoute,
              public perfisService: PerfisService,
              public usuarioService: UsuarioService,
              public router: Router,
              private element: ElementRef,
              private emailTokenService: EmailTokenService,
              private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.addResponsavelForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      telefoneFixo: ['', [Validators.required, Validators.minLength(6)]],
      celular: ['', [Validators.required, Validators.minLength(6)]],
      cargo: ['', Validators.required],
      papeis: ['', Validators.required],
      recebeEmail: [''],
    });
    this.titleService.setTitle("Adicionar Responsáveis - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.checked = false;
    this.Termos = this.BuildTermo();
    this.TextTermos = this.BuildTextTermo();
    this.validarFormulario = false;
    this.carregarComboPerfis();
    
  }

  ngAfterViewInit(){
    
  }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

  populaTabelaPapeisResponsaveis(
    nome: string,
    email: string,
    telefoneFixo: string,
    celular: string,
    cargo: string,
    recebeEmail: boolean,
    listaPapelAtribuidosEditar: Perfil[] = []) {
    let papeis = '';
    let dadoPapel = '';
    let resultadoPapel = '';
    let resultado = false;
    let i = 1;

    for (const papel of this.listaPapeisAtribuidos) {
      if (i < this.listaPapeisAtribuidos.length) {
        papeis = papeis + papel.nome + ', ';
        i = i + 1;
      } else {
        papeis = papeis + papel.nome;
      }
    }
    for (const papelExistente of this.listaPapeisResponsavel) {
      dadoPapel = dadoPapel + papelExistente.papel;
    }

    if (dadoPapel === '') {
      this.listaPapeisResponsavel.push(new ResponsavelPapeis(nome,
        papeis, email, telefoneFixo, celular, cargo, listaPapelAtribuidosEditar, recebeEmail));
      this.dataSource = new MatTableDataSource(this.listaPapeisResponsavel);
      this.addResponsavelForm.reset();
      this.listaPapeisAtribuidos = [];
      localStorage.setItem('dados', JSON.stringify(this.listaResponsaveis));
    } else if (papeis.includes(dadoPapel)) {
      this.listaResponsaveis.pop();
      PcsUtil.swal().fire({
        title: 'Adicionar Responsáveis',
        text: `O mesmo papel não pode ser atribuído a pessoas diferentes`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    } else if (dadoPapel.includes(papeis)) {
      this.listaResponsaveis.pop();
      PcsUtil.swal().fire({
        title: 'Adicionar Responsáveis',
        text: `O mesmo papel não pode ser atribuído a pessoas diferentes`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    } else {
      for (const papelTeste of this.listaPapeisAtribuidos) {
        resultadoPapel = papelTeste.nome;
        if (dadoPapel.includes(resultadoPapel)) {
          resultado = true;
        }
      }
      if (resultado === false) {
        this.listaPapeisResponsavel.push(new ResponsavelPapeis(nome,
          papeis, email, telefoneFixo, celular, cargo, listaPapelAtribuidosEditar, recebeEmail));
        this.dataSource = new MatTableDataSource(this.listaPapeisResponsavel);
        this.listaPapeisAtribuidos = [];
        this.addResponsavelForm.reset();
        localStorage.setItem('dados', JSON.stringify(this.listaResponsaveis));
      } else {
        this.listaResponsaveis.pop();
        PcsUtil.swal().fire({
          title: 'Adicionar Responsáveis',
          text: `O mesmo papel não pode ser atribuído a pessoas diferentes`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        }, error => { });
      }
    }
  }

  // Adicionar responsavel a tabela
  adicionarResponsavel() {
    const novoResponsavel = new Usuario();
    novoResponsavel.nome = this.addResponsavelForm.controls['nome'].value;
    novoResponsavel.email = this.addResponsavelForm.controls['email'].value;
    novoResponsavel.telefone_fixo = this.addResponsavelForm.controls['telefoneFixo'].value;
    novoResponsavel.telefone = this.addResponsavelForm.controls['celular'].value;
    novoResponsavel.cargo = this.addResponsavelForm.controls['celular'].value;
    novoResponsavel.prefeitura = this.emailToken.aprovacaoPrefeitura.prefeitura;
    if (this.addResponsavelForm.controls['recebeEmail'].value != null){
      novoResponsavel.recebeEmail = this.addResponsavelForm.controls['recebeEmail'].value;
    }
    else {
      novoResponsavel.recebeEmail = false;
    }


    // Preenche lista de Papeis na Credencial do responsavel
    novoResponsavel.credencial.listaPerfil = this.listaPapeisAtribuidos;
    this.listaResponsaveis.push(novoResponsavel);
    this.populaTabelaPapeisResponsaveis(
      this.addResponsavelForm.controls['nome'].value,
      this.addResponsavelForm.controls['email'].value,
      this.addResponsavelForm.controls['telefoneFixo'].value,
      this.addResponsavelForm.controls['celular'].value,
      this.addResponsavelForm.controls['cargo'].value,
      this.addResponsavelForm.controls['recebeEmail'].value,
      this.listaPapeisAtribuidos
    );
  }

  enviarDados() {
    let qtdPapel = '';
    let i = 1;

    for (const contarQtdPapel of this.listaPapeisResponsavel) {
      if (i < this.listaPapeisResponsavel.length) {
        qtdPapel = qtdPapel + contarQtdPapel.papel + ' ';
        i = i + 1;
      } else {
        qtdPapel = qtdPapel + contarQtdPapel.papel;
      }
    }
    // Validar se todos os papeis estão atribuidos
    if (qtdPapel.includes('Responsável pelo PCS')) {
      this.numeroPapeis = this.numeroPapeis + 1;
    }
    if (qtdPapel.includes('Responsável pelos Indicadores')) {
      this.numeroPapeis = this.numeroPapeis + 1;
    }
    if (qtdPapel.includes('Responsável pelas Boas Práticas')) {
      this.numeroPapeis = this.numeroPapeis + 1;
    }

    if (this.numeroPapeis === 3) {
      this.usuarioService.inserirListaResponsaveis(this.listaResponsaveis).subscribe(response => {
        PcsUtil.swal().fire({
          title: 'Adicionar Responsáveis',
          text: `Responsáveis cadastrados com sucesso`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/institucional']);
        }, error => { });
      });
    } else {
      PcsUtil.swal().fire({
        title: 'Adicionar Responsáveis',
        text: `Todos os papéis devem possuir um responsável`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
      this.numeroPapeis = 0;
    }
  }

  remover(papelResponsavel: ResponsavelPapeis) {
    if (this.listaResponsaveis.length !== 0) {
      this.listaResponsaveis.forEach((item, index) => {
        if (papelResponsavel.nome === item.nome) {
          this.listaResponsaveis.splice(index, 1);
          this.listaPapeisResponsavel.forEach((item, index) => {
            if (papelResponsavel.nome === item.nome) {
              this.listaPapeisResponsavel.splice(index, 1);
            }
          });
          this.dataSource = new MatTableDataSource<ResponsavelPapeis>(this.listaPapeisResponsavel);
        }
      });
    } else {
      this.listaPapeisResponsavel.forEach((item, index) => {
        if (papelResponsavel.nome === item.nome) {
          this.listaPapeisResponsavel.splice(index, 1);
        }
      });
      this.dataSource = new MatTableDataSource<ResponsavelPapeis>(this.listaPapeisResponsavel);
    }
  }

  editar(entrada) {
    localStorage.setItem('editar', JSON.stringify(entrada));
    const obj = JSON.parse(localStorage.getItem('editar'));

    this.addResponsavelForm.controls['nome'].setValue(obj.nome);
    this.addResponsavelForm.controls['email'].setValue(obj.email);
    this.addResponsavelForm.controls['telefoneFixo'].setValue(obj.telefoneFixo);
    this.addResponsavelForm.controls['celular'].setValue(obj.celular);
    this.addResponsavelForm.controls['cargo'].setValue(obj.cargo);
    this.addResponsavelForm.controls['recebeEmail'].setValue(obj.recebeEmail);
    this.listaPapeisAtribuidos = obj.listaPapelAtribuidosEditar;
    this.remover(entrada);
    this.verificaCampo();
  }

  verificaCampo() {
    if (this.addResponsavelForm.controls.nome.value === '') {
      this.addResponsavelForm.reset();
    }
  }

  adicionarPapel() {
    const consulta = this.perfisCombo.find(x => x.id === this.addResponsavelForm.controls.papeis.value);

    if (consulta === undefined) {
    } else {
      // Verifica se o item ja tem na lista
      if (this.perfisCombo.length > 0) {
        const listaAtual = this.listaPapeisAtribuidos.find(x => x.id === this.addResponsavelForm.controls.papeis.value);
        if (listaAtual !== undefined) {
          PcsUtil.swal().fire({
            title: 'Adicionar Responsáveis',
            text: `Papel já inserido.`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });
        } else {
          this.listaPapeisAtribuidos.push(consulta);
        }
      } else {
        this.listaPapeisAtribuidos.push(consulta);
      }
      this.addResponsavelForm.controls.papeis.setValue('');
      this.addResponsavelForm.controls.papeis.setValidators([]);
      this.addResponsavelForm.controls.papeis.updateValueAndValidity();
    }
  }

  removePapel(papel) {
    this.listaPapeisAtribuidos.forEach((item, index) => {
      if (item === papel) {
        this.listaPapeisAtribuidos.splice(index, 1);
        this.removeRequiredAddPapel();
      }
    });
  }

  carregarComboPerfis() {
    this.perfisService.buscarPerfisGestaoPublica().subscribe(perfis => {
      this.perfilPrefeitura = perfis.filter(perfil => perfil['nome'] == 'Responsável pela Prefeitura');
      this.perfisCombo = perfis.filter(perfil => perfil['nome'] !== 'Responsável pela Prefeitura');

      this.inscricao = this.activatedRoute.queryParams.subscribe(
        (queryParams: any) => {
          const token = queryParams.token;
          this.emailTokenService.buscarByHash(token)
            .subscribe(result => {
              this.emailToken = result as EmailToken;
              this.criarUsuarioPrefeito();
            });
        }
      );
    });
  }

  BuildTermo(): string {
    return 'Os signatários do Programa Cidades Sustentáveis tem à disposição um espaço virtual no portal www.cidadessustentaveis.org.br ' +
      'para apresentar o diagnóstico do município por meio dos indicadores, o Plano de Metas e divulgar boas práticas.' +
      'Este espaço virtual é chamado de observatório. ' +
      'Um observatório cumpre uma dupla função: é fonte de informação para o planejamento' +
      ', gestão e tomada de decisão da administração pública, assim como de transparência,' +
      'acompanhamento e fiscalização para toda a sociedade.' +
      'Para ter acesso ao sistema, é necessário o preenchimento do formulário de' +
      'cadastro com a indicação das pessoas que serão responsáveis pelo Programa Cidades Sustentáveis na gestão municipal.' +
      'É importante salientar que a prefeitura: XXX é responsável por manter atualizadas as informações' +
      ' de cadastro no sistema. As pessoas indicadas' +
      ' pelo prefeito/a XXX receberão seus usuários via e-mail e cadastrarão suas senhas, que são pessoais.' +
      ' Portanto é de responsabilidade de cada uma das pessoas indicadas o uso adequado de suas senhas,' +
      ' bem como a responsabilidade de inserção de dados no sistema de seu município.';
  }

  BuildTextTermo(): string {
    return 'Eu, prefeito XXX , concordo com os termos acima e quero preencher o formulário de cadastro com a ' +
      'indicação das pessoas responsáveis pela administração do sistema da prefeitura:' +
      'XXX na Plataforma do Conhecimento Cidades Sustentáveis.';
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

  onChange() {
  }

  getCampoNome() {
    return this.addResponsavelForm.get('nome').hasError('required') ? 'Campo nome é obrigatório' : '';
  }

  getCampoEmail() {
    return this.addResponsavelForm.get('email').hasError('required') ? 'Campo e-mail é obrigatório' :
      this.addResponsavelForm.get('email').hasError('pattern') ? 'O e-mail informado está fora do padrão' : '';
  }

  getCampoTelefoneFixo() {
    return this.addResponsavelForm.get('telefoneFixo').hasError('required') ? 'Campo telefone fixo é obrigatório' :
      this.addResponsavelForm.get('telefoneFixo').hasError('minlength') ? 'O número de telefone fixo deve ser completo' : '';
  }

  getCampoCelular() {
    return this.addResponsavelForm.get('celular').hasError('required') ? 'Campo celular é obrigatório' :
      this.addResponsavelForm.get('celular').hasError('minlength') ? 'O número de celular deve ser completo' : '';
  }

  getCampoCargo() {
    return this.addResponsavelForm.get('cargo').hasError('required') ? 'Campo cargo é obrigatório' : '';
  }

  adicionaRequired() {
    this.addResponsavelForm.controls.nome.setValidators([Validators.required]);
    this.addResponsavelForm.controls.nome.updateValueAndValidity();
    this.addResponsavelForm.controls.email.setValidators([Validators.required]);
    this.addResponsavelForm.controls.email.updateValueAndValidity();
    this.addResponsavelForm.controls.telefoneFixo.setValidators([Validators.required]);
    this.addResponsavelForm.controls.telefoneFixo.updateValueAndValidity();
    this.addResponsavelForm.controls.celular.setValidators([Validators.required]);
    this.addResponsavelForm.controls.celular.updateValueAndValidity();
    this.addResponsavelForm.controls.cargo.setValidators([Validators.required]);
    this.addResponsavelForm.controls.cargo.updateValueAndValidity();
    this.addResponsavelForm.controls.papeis.setValidators([Validators.required]);
    this.addResponsavelForm.controls.papeis.updateValueAndValidity();
  }

  removeRequired() {
    this.addResponsavelForm.controls.nome.setValidators([]);
    this.addResponsavelForm.controls.nome.updateValueAndValidity();
    this.addResponsavelForm.controls.email.setValidators([]);
    this.addResponsavelForm.controls.email.updateValueAndValidity();
    this.addResponsavelForm.controls.telefoneFixo.setValidators([]);
    this.addResponsavelForm.controls.telefoneFixo.updateValueAndValidity();
    this.addResponsavelForm.controls.celular.setValidators([]);
    this.addResponsavelForm.controls.celular.updateValueAndValidity();
    this.addResponsavelForm.controls.cargo.setValidators([]);
    this.addResponsavelForm.controls.cargo.updateValueAndValidity();
    this.addResponsavelForm.controls.papeis.setValidators([]);
    this.addResponsavelForm.controls.papeis.updateValueAndValidity();
  }

  removeRequiredAddPapel() {
    this.addResponsavelForm.controls.papeis.setValidators([]);
    this.addResponsavelForm.controls.papeis.updateValueAndValidity();
  }

  criarUsuarioPrefeito(){
    const prefeitura = this.emailToken.aprovacaoPrefeitura.prefeitura;

    const novoResponsavel = new Usuario();
    novoResponsavel.nome = prefeitura.nome;
    novoResponsavel.email = prefeitura.email;
    novoResponsavel.telefone_fixo = prefeitura.telefone;
    novoResponsavel.telefone = prefeitura.telefone;
    novoResponsavel.cargo = prefeitura.cargo;
    novoResponsavel.prefeitura = prefeitura;
    novoResponsavel.recebeEmail = true;
  
    // Preenche lista de Papeis na Credencial do responsavel
    novoResponsavel.credencial.listaPerfil = this.perfilPrefeitura;
    this.listaPapeisAtribuidos.push(this.perfilPrefeitura[0]);
    this.listaResponsaveis.push(novoResponsavel);

    this.populaTabelaPapeisResponsaveis(
      novoResponsavel.nome,
      novoResponsavel.email,
      novoResponsavel.telefone_fixo,
      novoResponsavel.telefone,
      novoResponsavel.cargo,
      novoResponsavel.recebeEmail,
      this.perfilPrefeitura
    );
  }

  public isUsuarioPrefeitura(usuario: ResponsavelPapeis): boolean {
    const perfis = usuario.listaPapelAtribuidosEditar
    let isPrefeitura = perfis.find(perfil => perfil.nome == 'Responsável pela Prefeitura');
    if(isPrefeitura) {
      return true;
    } else {
      return false;
    }
  }
  
}

