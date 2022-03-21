import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, PageEvent, MatTableDataSource, Sort, MatDialog, MatDialogConfig } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';

@Component({
  selector: 'app-usuario-prefeitura',
  templateUrl: './usuario-prefeitura.component.html',
  styleUrls: ['./usuario-prefeitura.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioPrefeituraComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any = [];
  displayedColumns = ['nome', 'email', 'uf', 'cidade', 'perfil', 'telefone', 'acoes'];
  visualizacao = false;
  usuarios = [];
  usuarioToXlsx = [];
  paginador: any;
  length = 100;
  pageSize = 10;
  private orderBy = 'nome';
  private direction = 'ASC';
  scrollUp: any;
  form: FormGroup;
  uf = '';
  cidade = '';
  nome = '';
  perfil = [];
  pagina = 0;

  dadosDownload = new DadosDownload;
  usuario: Usuario;
  estaLogado = false;

  constructor(
    private usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
    private dadosDownloadService: DadosDownloadService,
    private dialog: MatDialog
    ) {

      this.form= this.formBuilder.group({
        uf: '',
        cidade: '',
        perfil: '',
        nome: ''
      });
      this.titleService.setTitle("Usuários de Prefeituras - Cidades Sustentáveis");
     }

  ngOnInit() {
    this.buscarUsuarios(0, this.pageSize, this.orderBy , this.direction, this.nome, this.uf, this.cidade, this.perfil);

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.buscarUsuarioLogado();
    }
  }

  filtrar(){
    this.nome = this.form.controls.nome.value;
    this.uf = this.form.controls.uf.value;
    this.cidade = this.form.controls.cidade.value;
    this.perfil = this.form.controls.perfil.value;
    this.buscarUsuarios(0, this.paginator.pageSize, this.orderBy, this.direction , this.nome , this.uf, this.cidade, this.perfil);
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.paginator.pageIndex = 0;
      this.buscarUsuarios(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction, this.nome, this.uf, this.cidade, this.perfil);
    }
  }


  public deletarUsuario(usuario: any): void {
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
                    this.buscarUsuarios(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction, this.nome, this.uf, this.cidade, this.perfil);
                  },
                  error => {}
                );
            });
          }
        },
        error => {}
      );
  }


  public buscarUsuarios(page: number, pageSize: number, orderBy: string, direction: string, nome: any, uf : any, cidade : any, perfil: any) {
    this.buscarUsuarioToXlsx(nome, uf, cidade, perfil);
    this.usuarioService
      .buscarUsuariosPrefeitura(page, pageSize, orderBy, direction, nome, uf, cidade, perfil)
      .subscribe(response => {
        this.usuarios = response;
        this.dataSource = new MatTableDataSource(response);
        if (response) {
          this.dataSource.sort = this.sort;
          this.paginator.length = this.usuarios[0].totalElements;
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
        }
      });
  }

  public carregarPaginaUsuarios(event: PageEvent): PageEvent {
    this.buscarUsuarios(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction, this.nome, this.uf, this.cidade, this.perfil);
    this.pageSize = event.pageSize;
    return event;
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

  public buscarUsuarioToXlsx(nome: any, uf : any, cidade : any, perfil: any) {
      this.usuarioService.buscarUsuariosPrefeituraFiltrado(nome, uf, cidade, perfil).subscribe(response => {
        this.usuarioToXlsx = response;
      })
  }

  formatarDadosParaXls() {
    let formatadosXlsList: any[] = [];
    if(this.usuarioToXlsx.length > 0){
      this.usuarioToXlsx.forEach( usuario => {        
        let formatadosXls: {} = {};
        formatadosXls['Código IBGE'] = usuario.codigoIbge;
        formatadosXls['Nome'] = usuario.nome;
        formatadosXls['Email'] = usuario.email;
        formatadosXls['UF'] = usuario.uf;
        formatadosXls['Cidade'] = usuario.cidade;
        formatadosXls['Perfil'] = usuario.nomePerfil;
        formatadosXls['Telefone'] = this.maskString(usuario.telefone, usuario.telefone.length >= 11 ? '(##) # ####-####' : '(##) ####-####');
        
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
        XLSX.writeFile(workBook, 'lista-usuarios-prefeitura.xlsx');
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

  public validacaoDownloadListaUsuariosPrefeiturasXls() {
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

  limparFiltro() {
    this.form.controls['nome'].setValue('');
    this.form.controls['cidade'].setValue('');
    this.form.controls['uf'].setValue('');
    this.form.controls['perfil'].setValue('');

    this.nome = '';
    this.uf = '';
    this.cidade = '';
    this.perfil = [];

    this.buscarUsuarios(0, this.pageSize, this.orderBy , this.direction, this.nome, this.uf, this.cidade, this.perfil);
  }

}
