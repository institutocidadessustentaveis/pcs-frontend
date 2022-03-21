import swal from 'sweetalert2';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BoletimTemplate01ToList } from 'src/app/model/BoletimTemplate01ToList';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-boletim-administracao',
  templateUrl: './boletim-administracao.component.html',
  styleUrls: ['./boletim-administracao.component.css']
})
export class BoletimAdministracaoComponent implements OnInit {

  public displayedColumns: string[];
  public dataSource: MatTableDataSource<BoletimTemplate01ToList>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private newsLetterService: NewsletterService,
    private noticiaService: NoticiaService,
    private titleService: Title,
    public pcsUtil: PcsUtil
  ) { 
    this.displayedColumns = ['titulo', 'dataHoraEnvio', 'nomeUsuario', 'acoes'];
  }

  ngOnInit() {
    this.titleService.setTitle('Administração de Boletins - Cidades Sustentáveis')
    this.buscarBoletinsTemplate01()
  }

  deletar(id: number) {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then(r => {
      if (r.value) {
        this.newsLetterService.deletar(id).subscribe(response => {
          this.buscarBoletinsTemplate01()
          swal.fire('Boletim deletado com sucesso', '', 'success')
        }, error => {
          console.log(error)
          swal.fire(error.error.error_description, '', 'error')
        })
      }
    })
  }

  buscarBoletinsTemplate01() {
    this.newsLetterService.buscarBoletinsTemplate01().subscribe(res => {
      this.dataSource = new MatTableDataSource<BoletimTemplate01ToList>(res);
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
    }, error => { });
  }

  public enviarPorId(id: number) {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente enviar por email o Boletim selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then(r => {
      if (r.value) {
        this.noticiaService.enviarBoletimTemplate01PorId(id).subscribe( res => {
            swal.fire('Boletim enviado com sucesso', '', 'success')
            this.buscarBoletinsTemplate01();
        }, error => {
          swal.fire('Erro ao enviar boletim.', '', 'error')
        })
      }
    })
  }

  removerCaracteresEspeciais(titulo: string) {
    return this.pcsUtil.replaceHtmlTags(titulo).replace(/\&nbsp;/g, '')
  }

}
