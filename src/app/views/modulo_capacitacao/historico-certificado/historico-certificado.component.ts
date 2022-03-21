import { HistoricoCertificadoCapacitacao } from './../../../model/historicoCertificadoCapacitacao';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { HistoricoCertificadoService } from './../../../services/historico-certificado.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { CertificadoCapacitacao } from './../../../model/certificadoCapacitacao';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-historico-certificado',
  templateUrl: './historico-certificado.component.html',
  styleUrls: ['./historico-certificado.component.css']
})
export class HistoricoCertificadoComponent implements OnInit {

  displayedColumns: string[] = ['nomeUsuario', 'certificado', 'data', 'acoes'];
  dataSource: MatTableDataSource<HistoricoCertificadoCapacitacao>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(
    private titleService: Title,
    public element: ElementRef,
    public router: Router,
    private historicoCertificadoService: HistoricoCertificadoService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
      this.carregarDados();
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`Histórico de Certificados - Cidades Sustentáveis`);
  }

  carregarDados() {
    this.historicoCertificadoService.buscarHistoricoCertificados()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.reverse());
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

  public deletar(certificado: HistoricoCertificadoCapacitacao): void {
    PcsUtil.swal()
      .fire({
        title: 'Histórico de Certificados',
        text: `Deseja realmente excluir esse histórico de certificado?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      })
      .then(
        result => {
          if (result.value) {
            this.historicoCertificadoService
              .excluirHistoricoCertificado(certificado.id)
              .subscribe(response => {
                PcsUtil.swal()
                  .fire({
                    title: 'Histórico de Certificados',
                    text: `Histórico de Certificados excluído`,
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
