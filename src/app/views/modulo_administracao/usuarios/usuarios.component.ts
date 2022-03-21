import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Usuario } from "src/app/model/usuario";
import { UsuarioService } from "src/app/services/usuario.service";
import { AuthService } from "src/app/services/auth.service";
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  PageEvent,
  Sort,
  MatDialogConfig,
  MatDialog
} from "@angular/material";
import { PcsUtil } from "src/app/services/pcs-util.service";
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from "@angular/forms";
import { filtroUsuario } from "src/app/model/filtroUsuario";
import { CidadeService } from "src/app/services/cidade.service";
import { Cidade } from "src/app/model/cidade";
import { PerfisService } from "src/app/services/perfis.service";
import { Perfil } from "src/app/model/perfil";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import * as XLSX from 'xlsx';
import moment from 'moment';
import { DadosDownload } from "src/app/model/dados-download";
import { DadosDownloadService } from "src/app/services/dados-download.service";
import { DadosDownloadComponent } from "src/app/components/dados-download/dados-download.component";
import Swal from "sweetalert2";
import mask from 'ngx-mask';
@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.css"]
})
export class UsuariosComponent implements OnInit {
  public dataSource: MatTableDataSource<Usuario>;
  options = [];
  paginador: any;
  visualizacao = false;
  formFiltro: FormGroup;
  usuarios: Usuario[] = [];
  perfisCombo: Perfil[] = [];
  cidadesCombo: Cidade[] = [];
  idCidadeSelecionado: number;
  nomeCidadeSelecionada: string;
  filteredOptions: Observable<any>;
  warningResultado: boolean = false;
  filtroUsuario: filtroUsuario = new filtroUsuario();
  usuariosToXls: any [] = [];
  public dadosDownload = new DadosDownload;
  usuario: Usuario;
  estaLogado = false;


  scrollUp: any;
  loading: boolean = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = [
    "Nome",
    "Perfis",
    "E-mail",
    "Telefone",
    "Município",
    "Instituição",
    "Ações"
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private titleService: Title,
    private element: ElementRef,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private perfilService: PerfisService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle("Administrar Usuários - Cidades Sustentáveis")

    this.formFiltro = this.formBuilder.group({
      nome: [null],
      cidade: [null],
      organizacao: [null],
      perfil: [null]
    })
  }

  ngOnInit() {
    this.carregarCombos();
    this.filtrarUsuarios();

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado){
      this.buscarUsuarioLogado();
    }
    this.filteredOptions = this.formFiltro.get('cidade')!.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  maskString(value, pattern) {
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

  formatarDadosParaXls() {
    let formatadosXlsList: any[] = [];
    if(this.usuariosToXls){
      this.usuariosToXls.forEach( usuario => {        
        let formatadosXls: {} = {};
        formatadosXls['Nome'] = usuario.nome;
        formatadosXls['Email'] = usuario.email;
        formatadosXls['UF'] = usuario.uf;
        formatadosXls['Cidade'] = usuario.cidade;
        formatadosXls['Perfil'] = usuario.nomePerfil;
        formatadosXls['Telefone'] = this.maskString(usuario.telefone, usuario.telefone.length >= 11 ? '(##) # ####-####' : '(##) ####-####');
        formatadosXls['Organização'] = usuario.organizacao ? usuario.organizacao : "N/A";
        formatadosXlsList.push(formatadosXls);
        });
        return formatadosXlsList
    }
    return null;
  }

  generateXls(){
      const registrosExportacao = this.formatarDadosParaXls();
      const workBook = XLSX.utils.book_new();
      if (registrosExportacao) {
        const workSheet = XLSX.utils.json_to_sheet(registrosExportacao);
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
        XLSX.writeFile(workBook, 'lista-usuarios.xlsx');
      }
      else {
        Swal.fire("Erro", "Não foi possível exportar a tabela.", "error")
      }
  }

  preencherDadosDownload() {
    this.dadosDownload.email = this.usuario.email;
    this.dadosDownload.nome = this.usuario.nome
    this.dadosDownload.organizacao = this.usuario.organizacao;
    this.dadosDownload.boletim = this.usuario.recebeEmail;
    this.dadosDownload.usuario = this.usuario.id;
    this.dadosDownload.nomeCidade = this.usuario.prefeitura.cidade ? this.usuario.prefeitura.cidade.nome : this.usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download da Tabela de Usuário';
    this.dadosDownload.pagina = 'Administrar Usuários';  
    this.dadosDownload.arquivo = 'Lista de Usuários';  
  }

  public validacaoDownloadListaUsuarioXls() {
    if(this.estaLogado) {
      this.preencherDadosDownload()
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateXls();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download da Tabela de Usuário';
      this.dadosDownload.pagina = 'Administrar Usuários';
      this.dadosDownload.arquivo = 'Lista de Usuários';
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateXls();
    } else {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      acao: "Download da Tabela de Usuário",
      pagina: "Administrar Usuários",
      arquivo: "Lista de Usuários"
    }

    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.generateXls();
      }
    });
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  public carregarCombos() {
    this.carregarComboPerfil();
    this.carregarComboCidades();
  }

  public carregarComboPerfil() {
    this.perfilService.buscarComboBoxPerfis().subscribe(perfis => {
      this.perfisCombo = perfis;
    })
  }

  public carregarComboCidades() {
    this.cidadeService.buscarCidadeComboBox().subscribe(cidades => {
      this.options = cidades;
      this.filteredOptions = this.formFiltro.get('cidade')!.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filter(label) : this.options.slice())
      );
    })

  }

  public setCidadeSelecionada(cidade) {
    this.idCidadeSelecionado = cidade.id;
    this.nomeCidadeSelecionada = cidade.label;
  }

  public getTextoExibicaoCidade(cidade?): string | undefined {
    return cidade ? cidade.label : undefined;
  }

  preencherFiltroUsuario() {
    this.filtroUsuario.nome = this.formFiltro.controls['nome'] ? this.formFiltro.controls['nome'].value : null;
    this.filtroUsuario.cidade = this.idCidadeSelecionado ? this.idCidadeSelecionado : null;
    this.filtroUsuario.perfil = this.formFiltro.controls['perfil'] ? this.formFiltro.controls['perfil'].value : null;
    this.filtroUsuario.organizacao = this.formFiltro.controls['organizacao'] ? this.formFiltro.controls['organizacao'].value : null;
  }

  public filtrarUsuarios() {
    this.preencherFiltroUsuario()
    this.loading = true;
    this.usuarioService.buscarFiltrado(this.filtroUsuario).subscribe(usuarios => {      
      this.loading = false;
      this.usuarios = usuarios as Usuario[];      
      this.usuariosToXls = this.usuarios;   
    if (this.usuarios.length > 0) {
      this.gerarTabela(this.usuarios);
      this.warningResultado = false;
    }
    else {
      this.warningResultado = true;
    }
    })

  }

  public editarBloqueioForum(usuario: Usuario): void {
    PcsUtil.swal()
    .fire({
      title: "Usuários",
      text: `Deseja realmente alterar o acesso do usuário ${usuario.nome} - ${usuario.email} ao Fórum?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    })
    .then(
      result => {
        if (result.value) {
          if (usuario.bloqueadoForum == true) {
            usuario.bloqueadoForum = false
          }
          else {
            usuario.bloqueadoForum = true;
          }
          this.usuarioService.editarBloqueioForum(usuario).subscribe(response => {
            PcsUtil.swal()
              .fire({
                title: "Usuários",
                text: `Permissão do usuário ${usuario.nome} para acessar fórum foi atualizada.`,
                type: "success",
                showCancelButton: false,
                confirmButtonText: "Ok"
              })
              .then(
                result => {
                  this.filtrarUsuarios();
                },
                error => {}
              );
          });
        }
      },
      error => {}
    );

  }

  public deletarUsuario(usuario: Usuario): void {
    PcsUtil.swal()
      .fire({
        title: "Usuários",
        text: `Deseja realmente excluir o usuário ${usuario.nome} - ${usuario.email}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.usuarioService.deletar(usuario.id).subscribe(response => {
              PcsUtil.swal()
                .fire({
                  title: "Usuários",
                  text: `Usuário ${usuario.nome} excluído.`,
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(
                  result => {
                    this.filtrarUsuarios();
                  },
                  error => {}
                );
            });
          }
        },
        error => {}
      );
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public mask(val: string, mask: string) {
    return PcsUtil.mask(val, mask);
  }

  editar(entrada) {
    localStorage.setItem("editar-obj", JSON.stringify(entrada));
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }

  public gerarTabela(listaUsuarios: Usuario[]) {    
    this.dataSource = new MatTableDataSource(listaUsuarios);
    this.dataSource.sort = this.sort;
    if (listaUsuarios) {
      this.paginator.length = listaUsuarios.length;
      this.paginator._intl.itemsPerPageLabel = "Itens por página";
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.paginator._intl.getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
      ) => {
        if (length == 0 || pageSize == 0) {
          return `0 de ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex =
          startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.dataSource.paginator = this.paginator;
    }
  }

  limparFiltro() {
    this.formFiltro.controls['nome'].setValue('');
    this.formFiltro.controls['cidade'].setValue('');
    this.idCidadeSelecionado = null;
    this.formFiltro.controls['perfil'].setValue('');
    this.formFiltro.controls['organizacao'].setValue('');
    this.filtrarUsuarios();

  }

  public escolheCorCadeado(usuario: Usuario) {
    if (usuario.bloqueadoForum === true)return `warn`
    return `primary`
  }

  public toolTipAcessoForum(usuario){
    if (usuario.bloqueadoForum) return `Acesso ao fórum está bloqueado`
    return `Acesso ao Fórum está liberado`
  }
}
