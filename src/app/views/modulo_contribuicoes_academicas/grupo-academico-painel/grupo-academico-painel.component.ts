import { Component, OnInit, Input } from '@angular/core';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { GrupoAcademicoPainel } from 'src/app/model/grupoAcademicoPainel';

@Component({
  selector: 'app-grupo-academico-painel',
  templateUrl: './grupo-academico-painel.component.html',
  styleUrls: ['./grupo-academico-painel.component.css']
})
export class GrupoAcademicoPainelComponent implements OnInit {
  @Input() idGrupoAcademico: number;
  public grupoAcademico: GrupoAcademicoPainel;
  public dropList: Number[] = [];
  constructor(
    private grupoAcademicoService: GrupoAcademicoService,
  ) { }

  ngOnInit() {
    this.buscarGrupoAcademico();
  }

  public buscarGrupoAcademico(){
    this.grupoAcademicoService.buscarGrupoAcademicoPorIdPainel(this.idGrupoAcademico).subscribe(res => {    
      this.grupoAcademico = res;
    })
  }

  adicionarDrop(id: number){
    if (this.dropList.includes(id)) {
      this.dropList.splice(this.dropList.indexOf(id), 1)
    }
    else {
      this.dropList.push(id);
    }
  }

  onDrop(id) {
    return this.dropList.includes(id);
  }

}
