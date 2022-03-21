import { AreaInteresse } from 'src/app/model/area-interesse';
import { Pais } from 'src/app/model/pais';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { Cidade } from 'src/app/model/cidade';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel'
import { Time } from '@angular/common';
import { LocaleDataIndex } from '@angular/common/src/i18n/locale_data';

export class EventoDetalhe {
    
    id: number;
    
    tipo: string;
	
    nome: string;

    horario: string;
	
    descricao: string;
	
    data: Date;
    
    dataHorario: any;

    organizador: string;
	
    temas: Array<Number>;
	
    pais: Pais;
    
    estado: ProvinciaEstado;

    cidade: Cidade;
	
    eixos: Array<any>;

    ods: ObjetivoDesenvolvimentoSustentavel;
	
    online: boolean;
	
    endereco: string;
	
    site: string;

	latitude: number;
	
	longitude: number;
	
    publicado: boolean;
	
	externo: boolean;
	
    linkExterno: string;
    
    temasNomes: Array<String>;

    enderecoExibicao: string;

    odsNomeString: string;

    noticiasRelacionadas: Array<number>;

    //campos para filtro
    dataInicio: Date;
    dataFim: Date;
}