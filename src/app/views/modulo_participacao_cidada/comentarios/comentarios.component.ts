import { ItemCombo } from './../../../model/ItemCombo ';
import { CidadeService } from './../../../services/cidade.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FiltroComentario } from './../../../model/filtroComentario';
import { Component, OnInit } from '@angular/core';
import { ComentarioService } from 'src/app/services/comentario.service';
import { Comentario } from 'src/app/model/comentario';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios: Array<Comentario>;
  public filtroComentario: FiltroComentario = new FiltroComentario();
  public formFiltro: FormGroup;
  public cidadesComboCompleta: Array<any> = [];
  public mostrarContato: number[] = [];

  constructor(
    private comentarioService: ComentarioService,
    public formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private titleService: Title,
  ) {
    this.formFiltro = this.formBuilder.group({
      palavraChave: [null],
      dataInicial: [null],
      dataFinal: [null],
      idCidade: [null],
    });
    this.titleService.setTitle("Testemunhos - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.buscarComentarios();
  }

  buscarComentarios() {
    this.comentarioService.buscarComentariosToListPublica()
    .subscribe(res => {
      this.comentarios = res;
      console.log(this.comentarios)
      this.preencherComboCidade(this.comentarios);
    })
  }

  onAdicionarMostrarContato(id: number){
    if (this.mostrarContato.includes(id)) {
      this.mostrarContato.splice(this.mostrarContato.indexOf(id), 1)
    }
    else {
      this.mostrarContato.push(id);
    }
  }

  onMostrarContato(id) {
    return this.mostrarContato.includes(id);
  }

  buscarComentariosFiltrados() {
    this.filtroComentario.idCidade = this.formFiltro.controls['idCidade'].value;
    this.filtroComentario.palavraChave = this.formFiltro.controls['palavraChave'].value;
    this.filtroComentario.dataInicial = this.formFiltro.controls['dataInicial'].value != null ? moment(this.formFiltro.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.filtroComentario.dataFinal = this.formFiltro.controls['dataFinal'].value != null ? moment(this.formFiltro.controls['dataFinal'].value).format('YYYY-MM-DD') : '';

    this.comentarioService.buscarComentarioFiltrado(this.filtroComentario).subscribe(
      res => {
        this.comentarios = res.reverse() as any;
      }
    );
  }

  limparFiltro() {
    this.formFiltro.controls['idCidade'].value != null ? this.formFiltro.controls['idCidade'].setValue(null) : '' ;
    this.formFiltro.controls['dataFinal'].value != null ? this.formFiltro.controls['dataFinal'].setValue(null) : '' ;
    this.formFiltro.controls['dataInicial'].value != null ? this.formFiltro.controls['dataInicial'].setValue(null) : '' ;
    this.formFiltro.controls['palavraChave'].value != null ? this.formFiltro.controls['palavraChave'].setValue(null) : '' ;
    this.buscarComentariosFiltrados();

  }

  preencherComboCidade(comentarios) {
    let idCidades: Array<number> = this.removeDuplicado(comentarios);
    if (idCidades != null) {
      idCidades.forEach(id => {
        this.cidadeService.buscarCidadePorId(id).subscribe(cidade => {
          this.cidadesComboCompleta.push(cidade)
        })
      })
    }
  }



  removeDuplicado(comentarios) {
    let aux: Array<number> = [];
    this.comentarios.forEach(comentario => {
      if(comentario.idCidade != null) {
        if (!aux.includes(comentario.idCidade)) {
          aux.push(comentario.idCidade);
        }
      }
    })
    if (aux.length > 0) {
      return aux
    }
    return null
  }
}
