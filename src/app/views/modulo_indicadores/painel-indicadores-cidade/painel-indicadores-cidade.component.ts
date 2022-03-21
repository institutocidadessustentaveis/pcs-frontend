import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-painel-indicadores-cidade',
  templateUrl: './painel-indicadores-cidade.component.html',
  styleUrls: ['./painel-indicadores-cidade.component.css']
})
export class PainelIndicadoresCidadeComponent implements OnInit {
  idGrupo: number;
  grupo: DropDownList[] = [
    { value: 0, viewValue: 'Cidades' },
    { value: 1, viewValue: 'Indicadores' },
  ];
  scrollUp: any;

  constructor(public authService: AuthService,private element: ElementRef
    ,private router: Router) {this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
     }

  ngOnInit() {
    this.idGrupo = 0;
  }

  tradeGrupo(value) {
    this.idGrupo = value;
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

}
