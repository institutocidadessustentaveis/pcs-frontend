import { ProvinciaEstado } from './provincia-estado';
import { PartidoPolitico } from './partido-politico';
import { CartaCompromisso } from './carta-compromisso';
import { Cidade } from './cidade';

export class Prefeitura {
    id: number = null;
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    partidoPolitico: PartidoPolitico;
    cidade: Cidade;
    cartaCompromisso: CartaCompromisso[] = [];
    signataria: boolean;
    inicioMandato: Date;
    fimMandato: Date;
}
