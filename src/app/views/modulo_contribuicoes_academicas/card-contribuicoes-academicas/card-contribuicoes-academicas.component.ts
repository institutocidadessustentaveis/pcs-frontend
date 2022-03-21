import { Component, OnInit, Input } from '@angular/core';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { GrupoAcademicoCard } from 'src/app/model/GrupoAcademicoCard';

@Component({
  selector: 'app-card-contribuicoes-academicas',
  templateUrl: './card-contribuicoes-academicas.component.html',
  styleUrls: ['./card-contribuicoes-academicas.component.css']
})
export class CardContribuicoesAcademicasComponent implements OnInit {
  @Input() idGrupoAcademico;
  public grupoAcademico: GrupoAcademicoCard; //TODO: Trocar para model


  constructor(private grupoAcademicoService: GrupoAcademicoService) { }

  ngOnInit() {
    this.buscarGrupoAcademico();
  }

  public buscarGrupoAcademico(){    
    if (this.idGrupoAcademico != undefined) {
      this.grupoAcademicoService.buscarGrupoAcademicoCard(this.idGrupoAcademico).subscribe(res => {
        this.grupoAcademico = res;
      })
    }
  }

}
