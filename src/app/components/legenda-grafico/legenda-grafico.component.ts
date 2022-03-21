import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-legenda-grafico',
  templateUrl: './legenda-grafico.component.html',
  styleUrls: ['./legenda-grafico.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendaGraficoComponent implements OnInit {

  @Input() variavel;
  constructor() { }

  ngOnInit() {

  }

}
