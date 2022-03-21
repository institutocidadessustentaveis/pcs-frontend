import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertaService } from 'src/app/services/alerta.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css'],
})
export class AlertaComponent implements OnInit {
  loading = false;
  form: FormGroup
  novosAlertas:any[] = [];
  alertasAntigos:any[] = [];
  scrollUp: any;

  constructor(
    private alertaService: AlertaService,
    private router: Router,
    private element: ElementRef,
    private titleService: Title,
    ) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
      this.titleService.setTitle("Alertas - Cidades Sustentáveis");
    }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.loading = true;
    this.alertaService.get().subscribe(
      res => {
        this.novosAlertas = res as any[];
        this.loading = false;
       
      }
    );
    this.loading = true;
    this.alertaService.getVisualizados().subscribe(
      res => {
        this.alertasAntigos = res as any[];
        this.loading = false;
    
      }
    );
  }

  visualizar(alerta){
    if(!alerta.visualizado){
      alerta.visualizado = true;
      this.alertaService.qtdNovos--;
      this.alertaService.visualizar(alerta).subscribe();
    }

  }



}
