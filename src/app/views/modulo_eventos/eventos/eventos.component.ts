import { AuthService } from './../../../services/auth.service';
import { EventoService } from 'src/app/services/evento.service';
import { PcsUtil } from './../../../services/pcs-util.service';
import { Evento } from './../../../model/Evento';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { EventosFiltrados } from 'src/app/model/eventoFiltro';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['nome', 'tipo', 'data', 'publicado', 'acoes'];
  public dataSource: MatTableDataSource<Evento>;
  public dataSourceFiltro: MatTableDataSource<EventosFiltrados>
  public tipoUsuario: String;
  public clonar: boolean = false;

  public formFiltro: FormGroup;

  public evento: Evento = new Evento;
  listaFiltrada: Array<Evento>;

  public orderBy: string;
  public pageSize;
  public direction: string = 'ASC';

  scrollUp: any;

  isAdmin: boolean;
  isPrefeitura: boolean;

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private titleService: Title,
    private formBuilder: FormBuilder
  ) { 
    this.titleService.setTitle("Administração de Eventos - Cidades Sustentáveis")

    this.formFiltro = this.formBuilder.group({
      nome: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  ngOnInit() {
    this.buscarEventos();
    this.verificaTipoUsuario();

    this.listaFiltrada = [];
    // this.buscarEventosFiltradosPorNomeData();
    this.formFiltro.controls['nome'].setValue('');

    this.validarPermissoes();
  }

  private buscarEventos() {
    this.eventoService.buscarEventos().subscribe(res => {
      this.dataSource = new MatTableDataSource<Evento>(res);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
    }, error => { });
  }

  public excluirEvento(idEvento: number): void {
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
        this.eventoService.excluirEvento(idEvento).subscribe(response => {
          PcsUtil.swal().fire('Evento!', `Excluído com sucesso.`, 'success');
          this.buscarEventos();
        });
      }
    });
  }

  public replicarEvento(idEvento: number): void {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente replicar o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.eventoService.buscarEventoPorId(idEvento)
        .subscribe(res => {
          res.id = null;
          this.eventoService.cadastrarEvento(res).subscribe(async response => {
            let novoEvento = response as Evento;
            await PcsUtil.swal().fire({
              title: 'Evento',
              text: `Evento Replicado`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            }).then((result) => {
              this.router.navigate([`/eventos/lista/editar/${novoEvento.id}`]);
            }, error => { });
          });
        })
      }
    });
  }

  public verificaTipoUsuario() {
    if (this.authService.isUsuarioPrefeitura()) {
      this.tipoUsuario = "Prefeitura";
    }
    else{
      this.usuarioService.buscarUsuarioLogado()
      .subscribe(res  => {
        if (res.nomePerfil.includes('Administrador')) {

          this.tipoUsuario = "Administrador";
            this.clonar = true;
        }
        else{
          this.tipoUsuario = "Responsável pelo PCS";
        }
      });
    }
  }

  public buscarEventosFiltradosPorNomeData(){
    this.evento.nome = this.formFiltro.controls['nome'].value;
    this.evento.dataInicio = this.formFiltro.controls['dataInicio'].value;
    this.evento.dataFim = this.formFiltro.controls['dataFim'].value;

    this.eventoService.buscarEventosFiltradosPorNomeData(this.evento).subscribe(res => {
      this.listaFiltrada = res as Array<Evento>;
      this.dataSource = new MatTableDataSource<Evento>(this.listaFiltrada);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     /* this.dataSource.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
        return item[property];
     };*/
      
    }, error => { });
    };

    public paginadorEventos(event: PageEvent): PageEvent {

      let columnSort: string = "data";
  
      if(this.sort.active != undefined) {
        columnSort = this.sort.active;
      }
  
      this.orderBy = columnSort;
  
      this.buscarEventosFiltradosPorNomeData();
  
      this.pageSize = event.pageSize;
  
      return event;
    }

    sortData(sort: Sort) {
      if (sort) {
        this.orderBy = sort.active;
        this.direction = sort.direction.toUpperCase();
  
        this.buscarEventosFiltradosPorNomeData();
      }
    }

    limparFiltro(){
      this.formFiltro.controls['nome'].setValue('');
      this.formFiltro.controls['dataInicio'].setValue('');
      this.formFiltro.controls['dataFim'].setValue('');

      this.evento.nome = null;
      this.evento.dataInicio = null;
      this.evento.dataFim = null;

      this.buscarEventosFiltradosPorNomeData();
    }
  
    validarPermissoes(){
      this.usuarioService.buscarUsuarioLogado().subscribe(user => {
        if(user.nomePerfil === 'Administrador'){
          this.isAdmin = true;
          this.isPrefeitura = false;
        }
        
        if(user.nomePerfil.includes('Responsável pelo PCS' || 'Responsável pelas Boas Práticas' || 'Responsável pelos Indicadores e pelo SIG')){
          this.isAdmin = false;
          this.isPrefeitura = true;
        }
      });
    }
}



