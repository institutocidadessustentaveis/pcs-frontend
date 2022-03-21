import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { GrupoAcademico } from 'src/app/model/grupo-academico';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import Swal from 'sweetalert2';
import { ModalInfoAcademicosComponent } from './modal-info-academicos/modal-info-academicos.component';
import { ModalErroAcademicosComponent } from './modal-erro/modal-erro-academicos.component';
import { ImportacaoAcademicosService } from 'src/app/services/importacao-academicos.service';

@Component({
  selector: 'app-grupo-academico-administracao',
  templateUrl: './grupo-academico-administracao.component.html',
  styleUrls: ['./grupo-academico-administracao.component.css']
})
export class GrupoAcademicoAdministracaoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;
  @ViewChild(MatSort) sort: MatSort;

  public estado;
  public displayedColumns: string[];
  public mostrarAvisoListaVazia: boolean = true;
  public dataSource: MatTableDataSource<GrupoAcademico>;
  public loading = true;
  public listaInfoArquivo: any; 
  public listaErros: any;

  constructor(
    private titleService: Title,
    private grupoAcademicoService: GrupoAcademicoService,
    private importacaoAcademicosService: ImportacaoAcademicosService,
    public dialog: MatDialog
  ) {
    this.displayedColumns = ['nomeGrupo', 'tipo', 'estado', 'cidade', 'acoes'];
   }

  ngOnInit() {
    this.buscarGruposAcademicos();
    this.titleService.setTitle("Grupos Acadêmicos - Cidades Sustentáveis")
  }


  
  public filtrar(nomeGrupoAcademico) {
    if (nomeGrupoAcademico != null && nomeGrupoAcademico != '') {
      this.grupoAcademicoService.filtrarGruposAcademicos(nomeGrupoAcademico).subscribe(response => {
        this.configurarTabela(response);
      })
    }
    else {
      this.buscarGruposAcademicos();
    }
    
  }

  configurarTabela(res) {
    this.dataSource = new MatTableDataSource<GrupoAcademico>(res);
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

  private buscarGruposAcademicos() {
    this.grupoAcademicoService.buscarGruposAcademicos().subscribe(res => {
      if (res.length > 0) {
        this.mostrarAvisoListaVazia = false;
        this.configurarTabela(res)
      }
    }, error => { 
      Swal.fire('Erro', 'Não foi possível buscar as Instituições', 'error')
    });
  }

  public excluirGrupoAcademico(idGrupoAcademico: number) {
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
        this.grupoAcademicoService.excluirGrupoAcademico(idGrupoAcademico).subscribe(response => {
          PcsUtil.swal().fire('Grupo Acadêmico!', `Excluído com sucesso.`, 'success');
          this.buscarGruposAcademicos();
        });
      }
    });
  }

  enviarArquivo(event: any) {
    
    this.loading = true;

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      PcsUtil.swal()
        .fire({
          title: "Enviar Arquivo",
          text: `Tem certeza que deseja importar o arquivo ${file.name} ?`,
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Sim",
          cancelButtonText: "Não"
        })
        .then(valor => {
          if (valor.value === true) {

            let dialogRef = this.dialog.open(this.modalLoading, {
              height: '300px',
              width: '300px',
            });

            this.importacaoAcademicosService.importar(file).subscribe(res => {
              this.dialog.closeAll();
              this.listaInfoArquivo = res
              
              let erros = this.listaInfoArquivo[1];
              console.log(erros);
              if (erros) {
                PcsUtil.swal()
                  .fire(
                    "Arquivo importado",
                    `Foram registrados alguns erros`,
                    "success"
                  )
                  .then(res => {
                    this.modalInfo(this.listaInfoArquivo);
                  });
              } else {
                PcsUtil.swal().fire("Arquivo importado", "", "success");
              }
              this.buscarGruposAcademicos();
            },error =>{
              this.dialog.closeAll();
            });
          }
        });
    }
    this.loading = false;
  }

  public modalInfo(listaDados){
    const dialogRef = this.dialog.open(ModalInfoAcademicosComponent, {
      data: {
        qtdVariaveisPreenchidas: listaDados[0],
        erros: listaDados[1]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.modalErro(listaDados[1]);
    });
  }

  public modalErro(erros) {
    const dialogRef = this.dialog.open(ModalErroAcademicosComponent, {
      data: {
        mensagem: erros
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }


}
