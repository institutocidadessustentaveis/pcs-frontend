import { ProvinciaEstado } from './provincia-estado';
import { PartidoPolitico } from './partido-politico';
import { CartaCompromisso } from './carta-compromisso';
import { Cidade } from './cidade';

export class PrefeituraEdicao {
    id: number = null;
    nomePrefeito: string;
    email: string;
    telefone: string;
    inicioMandato: Date;
    fimMandato: Date;
    idPais: number;
    idEstado: number;
    idCidade: number;
    idPartido: number;
    cartasCompromisso:any;
}
