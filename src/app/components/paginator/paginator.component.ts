import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];
  desde: number;
  ate: number;

  constructor() { }

  ngOnInit() {
    this.initPaginador();
  }

  ngOnChanges(changes: SimpleChanges){
    let paginadorAtualizado = changes['paginador'];

    if (paginadorAtualizado.previousValue){
      this.initPaginador();
    }
  }

  private initPaginador(): void{
    this.desde = Math.min(Math.max(1,this.paginador.number-4), this.paginador.totalPages-5);
    this.ate = Math.max(Math.min(this.paginador.totalPages,this.paginador.number+4), 6);

    if (this.paginador.totalPages > 5){
      this.paginas = new Array(this.ate - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

}
