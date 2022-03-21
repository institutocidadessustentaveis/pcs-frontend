import { Component, Input, OnInit } from '@angular/core';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-solucao',
  templateUrl: './card-solucao.component.html',
  styleUrls: ['./card-solucao.component.css']
})
export class CardSolucaoComponent implements OnInit {

  @Input() solucao: any;
  urlEndPoint = `${environment.API_URL}boapratica`;

  constructor(
  ) { }

  ngOnInit() {
  }

  gerarLinkSolucao(solucao: any) {
    var solucaoFormat = solucao.nome.toLowerCase();
    solucaoFormat = solucaoFormat.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    solucaoFormat = solucaoFormat.replace(' ', '-');

    return 'https://oics.cgee.org.br/solucoes/' + solucaoFormat + '_' + solucao._id;
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }
}
