import { PcsUtil } from 'src/app/services/pcs-util.service';
import { CertificadoService } from './../../../services/certificado.service';
import { Router } from '@angular/router';
import { Certificado } from './../../../model/certificado';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-certificado-list',
  templateUrl: './certificado-list.component.html',
  styleUrls: ['./certificado-list.component.css']
})
export class CertificadoListComponent implements OnInit {

  displayedColumns: string[] = ['titulo', 'acoes'];
  dataSource: MatTableDataSource<Certificado>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(
    public titleService: Title,
    public element: ElementRef,
    public router: Router,
    public certificadoService: CertificadoService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`Certificados - Cidades Sustentáveis`);
    this.carregarDados();
  }

  carregarDados() {
    this.certificadoService.buscarCertificadosResumidos()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "Itens por página";
        this.paginator._intl.getRangeLabel = (
          page: number,
          pageSize: number,
          length: number
        ) => {
          if (length == 0 || pageSize == 0) {
            return `0 de ${length}`;
          }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          const endIndex =
            startIndex < length
              ? Math.min(startIndex + pageSize, length)
              : startIndex + pageSize;
          return `${startIndex + 1} - ${endIndex} de ${length}`;
        };
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
      });
  }

  public deletar(certificado: Certificado): void {
    PcsUtil.swal()
      .fire({
        title: 'Certificados',
        text: `Deseja realmente excluir o certificado ${certificado.titulo}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      })
      .then(
        result => {
          if (result.value) {
            this.certificadoService
              .excluirCertificado(certificado.id)
              .subscribe(response => {
                PcsUtil.swal()
                  .fire({
                    title: 'Certificados',
                    text: `Certificado: ${certificado.titulo} excluído`,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                  })
                  .then(
                    result => {
                      this.carregarDados();
                    },
                    error => { }
                  );
              });
          }
        },
        error => { }
      );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
