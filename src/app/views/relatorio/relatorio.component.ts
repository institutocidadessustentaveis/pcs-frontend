import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})

export class RelatorioComponent implements OnInit {

  idRelatorio: number;
  relSelected: number;

  reports: DropDownList[] = [
    { value: 12, viewValue: 'Visualização cartográfica de indicadores' },
    { value: 2, viewValue: 'Acesso às sessões' },
    { value: 6, viewValue: 'Ações gestores municipais' },
    { value: 1, viewValue: 'Atividades do usuário' },
    { value: 23, viewValue: 'Extrair Conteúdo das Boas Práticas de Prefeituras Signatárias' },
    { value: 21, viewValue: 'Extrair Conteúdo das Boas Práticas do PCS' },
    { value: 3, viewValue: 'Conteúdos compartilhados' },   
    { value: 22, viewValue: 'Contagem de boas práticas do PCS' },
    { value: 24, viewValue: 'Contagem de boas práticas das cidades signatárias' },
    { value: 4, viewValue: 'Downloads e exportações' },
    { value: 20, viewValue: 'Eventos' },
    { value: 10, viewValue: 'Indicadores preenchidos' },
    { value: 5, viewValue: 'Interação chat/fórum' },
    { value: 15, viewValue: 'Interação de usuários com as ferramentas agenda, mapa de alerta, eventos, enquetes e pesquisas de satisfação' },
    { value: 19, viewValue: 'Plano de metas e Prestação de contas' },
    { value: 11, viewValue: 'Planos de metas' },
    { value: 14, viewValue: 'Quantidade de indicadores cadastrados' },
    { value: 13, viewValue: 'Quantidade de indicadores preenchidos' },
    { value: 25, viewValue: 'Registro dos usuários' },
    { value: 0, viewValue: 'Relatórios gerados' },
    { value: 16, viewValue: 'Shapes cadastrados pelo PCS' },
    { value: 18, viewValue: 'Shapes cadastrados pela Prefeitura'},
    { value: 17, viewValue: 'Shapes exportados' },
    { value: 26, viewValue: 'Indicadores completo' },
    { value: 27, viewValue: 'API Pública' }
  ]
  reportsOrdenados: DropDownList[] = []
  scrollUp: any;

  constructor(public relatorioService: RelatorioService, public activatedRoute: ActivatedRoute, public authService: AuthService,
              private element: ElementRef, private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
  }); }

  ngOnInit() {
    this.idRelatorio = 2;
    this.relSelected = 2;
    this.reportsOrdenados = this.reports.sort(this.ordenar);
  }

  tradeComponent(value) {
    this.idRelatorio = Number(value);
    this.relatorioService.tradeComponent(this.idRelatorio);
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  ordenar(a,b) {
    if(a.viewValue.replace(/[^a-zA-Zs]/g, "") < b.viewValue.replace(/[^a-zA-Zs]/g, "")) {
       return -1;
    }
    else if(a.viewValue.replace(/[^a-zA-Zs]/g, "") > b.viewValue.replace(/[^a-zA-Zs]/g, "")) {
      return 1;
    }
  }
}

