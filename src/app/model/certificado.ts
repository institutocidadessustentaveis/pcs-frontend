import { Arquivo } from 'src/app/model/arquivo';
export class Certificado {
    id: number;
    titulo: string;
    texto1: string;
    texto2: string;
    texto3: string;
    imagem: Arquivo;
    orientacaoPaisagem: boolean;
}