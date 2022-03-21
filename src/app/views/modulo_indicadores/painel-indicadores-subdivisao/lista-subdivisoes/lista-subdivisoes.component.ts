import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-lista-subdivisoes',
  templateUrl: './lista-subdivisoes.component.html',
  styleUrls: ['./lista-subdivisoes.component.css']
})
export class ListaSubdivisoesComponent implements OnInit {
  @Input() subdivisao;
  link = ''
  constructor(private route:ActivatedRoute) {
  }

  ngOnInit() {
    let sigla = PcsUtil.toSlug(this.route.snapshot.params['siglaestado']);
    let cidade = PcsUtil.toSlug(this.route.snapshot.params['nomecidade']);
    let nomesubdivisao = PcsUtil.toSlug(this.subdivisao.nome);
    this.link = `/painel-subdivisoes/${sigla}/${cidade}/${nomesubdivisao}`;
  }

}
