import { Component, OnInit, ViewChild } from '@angular/core';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Biblioteca } from 'src/app/model/biblioteca';
import { Title } from '@angular/platform-browser';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-biblioteca-administracao',
  templateUrl: './biblioteca-administracao.component.html',
  styleUrls: ['./biblioteca-administracao.component.css']
})
export class BibliotecaAdministracaoComponent implements OnInit {

  public displayedColumns: string[];
  public dataSource: MatTableDataSource<Biblioteca>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public mostrarAvisoListaBibliotecasVazia: boolean = false;

  public usuario: Usuario;
  
  constructor(
    private bibliotecaService: BibliotecaService,
    private titleService: Title,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    
  ) { 
    this.displayedColumns = ['tituloPublicacao', 'subtitulo', 'dataPublicacao', 'autor', 'acoes'];
  }

  ngOnInit() {
    this.titleService.setTitle("Administração de Biblioteca - Cidades Sustentáveis")
    this.buscarUsuarioLogado();
  }

  private buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario;
      this.buscarBibliotecas();
    })
  }

  private buscarBibliotecas() {
    if (this.ehUsuarioAdministrador()) {
      this.buscarBibliotecasAdmin()
    }
    else {
      this.buscarBibliotecasUsuarioComum()
    }
  }

  private ehUsuarioAdministrador() {
    if (this.authService.hasPerfil("Administrador")) return true
    return false
  }
  
  public buscarBibliotecasAdmin() {
    this.bibliotecaService.buscarBibliotecasToListAdmin().subscribe(res => {
      this.definirExibicaoLista(res)
    }, error => { });
  }

  public buscarBibliotecasUsuarioComum() {
    this.bibliotecaService.buscarBibliotecas(this.usuario.id).subscribe(res => {
      this.definirExibicaoLista(res)
    }, error => { });
  }

  public definirExibicaoLista(bibliotecas: any) {
    if (bibliotecas.length == 0) {
        this.mostrarAvisoListaBibliotecasVazia = true;
    }
    else {
      this.organizarTabela(bibliotecas)
    }
  }
  public organizarTabela(bibliotecas) {
    this.dataSource = new MatTableDataSource<Biblioteca>(bibliotecas);
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
      return item[property];
   };
    this.dataSource.sort = this.sort;
  }

  public excluirBiblioteca(idBiblioteca: number): void {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.bibliotecaService.excluirBiblioteca(idBiblioteca).subscribe(response => {
          PcsUtil.swal().fire('Biblioteca!', `Excluída com sucesso.`, 'success');
          this.buscarBibliotecas();
        });
      }
    });
  }

}
