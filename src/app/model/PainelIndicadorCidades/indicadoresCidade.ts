import { SafeUrl } from '@angular/platform-browser';
import { Mandatos } from './mandatos';

export class IndicadoresCidade{
    cidade:string;
    estado:string;
    uf:string;
    pais:string;
    mandatos:Array<Mandatos>;
    latitude:number;
    longitude:number;
    site: string;
    area: string;
    densidadeDemografica: string;
    salarioMedioMensal: string;
    populacaoOcupada: string;
    pibPerCapita: string;
    idhM: string;
    textoCidade: string;
    fotoCidade: SafeUrl;
    populacao: string;
    enderecoDaPrefeitura: string;
    idRelatorioContas: number;
    idPlanoMetas: number;
    possuiIndicadoresCadastrados: boolean;
}
