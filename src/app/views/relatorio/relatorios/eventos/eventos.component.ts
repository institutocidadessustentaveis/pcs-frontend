import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
// Model
import { Eventos } from '../../../../model/Relatorio/Eventos';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  formulario: FormGroup;
  displayedColumns: string[] = ['titulo', 'dataHora', 'npessoasAdicionaram', 'npessoasCadastradas', 'npessoasSeguiram', 'npessoasVisualizaram'];
  dataSource = new MatTableDataSource<Eventos>();
  eventos: Eventos = new Eventos();
  loading: any;
  tabela: Array<Eventos> = new Array<Eventos>();
  titulo = 'Eventos';
  colunas = [
    { title: 'Titulo', dataKey: 'titulo' },
    { title: 'Data/Hora', dataKey: 'dataHora' },
    { title: 'Nº Agendamentos', dataKey: 'npessoasAdicionaram' },
    { title: 'Nº Cadastros', dataKey: 'npessoasCadastradas' },
    { title: 'Nº Seguidores', dataKey: 'npessoasSeguiram' },
    { title: 'Nº Visualizações', dataKey: 'npessoasVisualizaram' }
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() idRelatorio: number;
  scrollUp: any;
  // tslint:disable-next-line:max-line-length
  constructor(public relatorioService: RelatorioService, public activatedRoute: ActivatedRoute, public authService: AuthService, public formBuilder: FormBuilder
    ,private element: ElementRef
    ,private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.formulario = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      titulo: [''],
      dataHora: [''],
      npessoasAdicionaram: [''],
      npessoasSeguiram: [''],
      npessoasVisualizaram: [''],
      npessoasCadastradas: ['']
    });
  }

  ngOnInit() {
  }

  searchReport() {
    this.loading = true;

    // Build Object to send

    this.eventos.titulo = this.formulario.controls.titulo.value;
    this.eventos.dataHora = this.formulario.controls.dataHora.value;
    this.eventos.npessoasAdicionaram = this.formulario.controls.npessoasAdicionaram.value;
    this.eventos.npessoasCadastradas = this.formulario.controls.npessoasCadastradas.value;
    this.eventos.npessoasSeguiram = this.formulario.controls.npessoasSeguiram.value;
    this.eventos.npessoasVisualizaram = this.formulario.controls.npessoasVisualizaram.value;


    this.relatorioService.searchEventos(this.eventos).subscribe(response => {
      this.dataSource = new MatTableDataSource<Eventos>(response);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.tabela = response;
      this.loading = false;
    }, error => { this.loading = false; });
  }

  formatarParaExportar(registros: Eventos[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      let dataHora = new Date(registro.dataHora).toLocaleDateString();
      formatado['dataHora'] = dataHora;
      formatado['titulo'] = registro.titulo;
      formatado['npessoasAdicionaram'] = registro.npessoasAdicionaram;
      formatado['npessoasCadastradas'] = registro.npessoasCadastradas;
      formatado['npessoasSeguiram'] = registro.npessoasSeguiram;
      formatado['npessoasVisualizaram'] = registro.npessoasVisualizaram;
      formatados.push(formatado)
    });
    return formatados;
  }

}
