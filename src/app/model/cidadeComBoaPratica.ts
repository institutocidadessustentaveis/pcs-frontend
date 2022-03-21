import { BoaPratica } from 'src/app/model/boaPratica';



export class CidadeComBoaPratica {
    idCidade: number ;
    nomeCidade: string ;
    latitude: number ;
    longitude: number ;
    countBoasPraticas: number;
    visualizarComoPontos: boolean;
    shapeZoneamento: Array<any>;
}
