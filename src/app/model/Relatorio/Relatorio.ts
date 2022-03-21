import { DatePipe } from '@angular/common';

export class Relatorio {
  id: number;
  nomeUsuario: string;
  dataHora: Date;
  usuarioLogado: string;

  // atributos usados na pesquisa das querys
  dataInicio: Date;
  dataFim: Date;

  anoInicio: number;
  anoFim: number;

  estado: string;
  cidade: string;
}
