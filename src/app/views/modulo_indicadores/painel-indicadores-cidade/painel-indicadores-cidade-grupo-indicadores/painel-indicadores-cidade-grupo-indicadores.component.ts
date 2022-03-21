import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-painel-indicadores-cidade-grupo-indicadores',
  templateUrl: './painel-indicadores-cidade-grupo-indicadores.component.html',
  styleUrls: ['./painel-indicadores-cidade-grupo-indicadores.component.css']
})
export class PainelIndicadoresCidadeGrupoIndicadoresComponent implements OnInit {
  scrollUp: any;

  constructor(
    private element: ElementRef
    ,private router: Router) { this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
  });}

  ngOnInit() {
  }

}
