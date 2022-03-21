import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';

export class ResultadoIndicadorDTO {
  nome:string;
  cor:string;
  resultado:string;
  label:string;
  resultadoVariaveis:Array<ResultadoVariavelDTO>;
}

export class ResultadoVariavelDTO{
  nome:string;
  cor:string;
  label:string;
}

@Component({
  selector: "app-preenchimento-indicadores-resultado",
  templateUrl: "./preenchimento-indicadores-resultado.component.html",
  styleUrls: ["./preenchimento-indicadores-resultado.component.css"]
})
export class PreenchimentoIndicadoresResultadoComponent implements OnInit {
  exibirResultado: boolean = false;
  loading: boolean = false;
  resultadoIndicadorDTO: ResultadoIndicadorDTO = new ResultadoIndicadorDTO();
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    public indicadoresPreenchidosService: IndicadoresPreenchidosService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarResultadoIndicador();
  }

  buscarResultadoIndicador() {
    this.exibirResultado = false;
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.indicadoresPreenchidosService
            .buscarResultadoIndicadorPorId(id)
            .subscribe(
              response => {
                this.resultadoIndicadorDTO = response as ResultadoIndicadorDTO;
                this.exibirResultado = true;
              },
              error => {
                this.loading = false;
              }
            );
        } else {
          this.exibirResultado = false;
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }
}
