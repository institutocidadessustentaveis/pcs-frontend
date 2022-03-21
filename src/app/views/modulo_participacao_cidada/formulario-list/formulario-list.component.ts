import moment from 'moment';
import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';
import { BuscarService } from 'src/app/services/buscar.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { FormularioPreenchidoService } from 'src/app/services/formulario-preenchido.service';
import * as XLSX from 'xlsx';
import { stringify } from 'querystring';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { FormBuilder, FormGroup } from '@angular/forms';

const pipeRemoveTagsHtml = new StripTagsPipe();
@Component({
  selector: 'app-formulario-list',
  templateUrl: './formulario-list.component.html',
  styleUrls: ['./formulario-list.component.css']
})

export class FormularioListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = ['nome', 'usuarioCriador', 'origem', 'publicado', 'dataCriacao', 'acoes'];
  listaFormulario = [];
  urlAPI = environment.API_URL;
  usuario: Usuario;
  podeExportarForm: boolean = false;
  formFiltro: FormGroup


  constructor(
    private busca: BuscarService,
    private usuarioService: UsuarioService,
    private formularioService: FormularioService,
    private formularioPreenchidoService: FormularioPreenchidoService,
    public formBuilder: FormBuilder
    ) { 
      this.formFiltro = this.formBuilder.group({
        campoPesquisa: ['']
      });
    }

  ngOnInit() {
    this.buscar()
    this.buscarUsuario()
  }

  public buscarUsuario() {
    this.usuarioService.buscarUsuarioLogado().subscribe(user => {
      this.usuario = user;      
    })
  }

  buscar(){
    this.formularioService.buscar().subscribe(res => {
      this.listaFormulario = res;      
      this.dataSource = new MatTableDataSource<any>(res);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    });
  }
  excluirFormulario(idFormulario) {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o Formulário selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.formularioService.excluir(idFormulario).subscribe(response => {
          PcsUtil.swal().fire('Excluído!', `Formulário excluído.`, 'success');
          this.buscar();
        });
      }
    });
  }

  AbrirSwalParaCopiar(itemLink) {
    PcsUtil.swal().fire(
      'Link Copiado com sucesso',
      `
     <input
     type="text" style="width: 90%" value="${location.origin}/formulario/${itemLink}"
      id="${itemLink}">
      </input>
     `,
      'success');

    this.copiarTexto(document.getElementById(itemLink));
  }

  copiarTexto(itemLink) {
    try {
      itemLink.select();
      document.execCommand('copy');
    } catch (e) {
      PcsUtil.swal().fire(
        'Erro ao copiar',
        'Um erro inesperado ocorreu ao tentar copiar o link',
        'error'
      )
    }
  }
  formatarParaExportar(idFormulario, formNome) {
    let formatados: any[] = [];
    this.formularioPreenchidoService.exportarFormularioPreenchido(idFormulario).subscribe(res => {      
      res.forEach(element => {
        let formatado: any =  {
          usuarioNome: '',
          logado: '',
          dataHora: '',
          respostas: []
        };
        formatado.usuarioNome = element.usuarioNome;
        formatado.logado = element.logado;
        formatado.dataHora = moment(element.dataPreenchimento).format('DD/MM/YYYY')+ ' ' + element.horario;

        element.respostas.forEach(x => {
          if (x.pergunta) {
            let perguntaFormatada = pipeRemoveTagsHtml.transform(x.pergunta);
            let respostas: {} = {};
            respostas['secao'] = x.secao;
            respostas['pergunta'] = perguntaFormatada;
            respostas['resposta'] = x.resposta != null ? x.resposta : (x.outro != null ? x.outro : (x.simNao != null ? x.simNao : x.textoLivre));
            formatado.respostas.push(respostas);
          }
        });
        formatados.push(formatado);
      });
      if(formatados.length > 0){
      return this.exportXls(formatados, formNome);
    }
    else {
      PcsUtil.swal().fire(
        '',
        'Formulário sem nenhuma resposta até o momento!',
        'warning'
      )
    }
    });
  }

  exportXls(formatados: any, formNome: string) {
    if (formatados) {
      const registrosExportacao = formatados;
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport('Formulario', registrosExportacao));
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
      XLSX.writeFile(workBook, formNome + '.xlsx');
    }
  }

  filtrarFormularioPorPalavraChave(){
    let listaFiltrada: any[] = [];
    let palavraChave: string = this.formFiltro.controls.campoPesquisa.value;

    if(palavraChave){
      listaFiltrada = this.listaFormulario.filter(form => {
        return form.nome.toLowerCase().includes(palavraChave.toLowerCase())
      });     
      this.reloadDataSource(listaFiltrada);
    } else {
      this.buscar();
    }
  }

  reloadDataSource(listaFiltrada){
    this.listaFormulario = listaFiltrada;
    this.dataSource = new MatTableDataSource<any>(this.listaFormulario);
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

}

