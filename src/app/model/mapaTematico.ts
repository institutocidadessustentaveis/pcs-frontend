import { ClasseMapaTematico } from './classeMapaTematico';



export class MapaTematico {
  id: number;
  nome: string;
  layerName: string;
  attributeName: string;
  type: string;
  idShapeFile: number;
  classes: ClasseMapaTematico[];
  corMinima: string;
  corMaxima: string;
  numeroClasses: number;
  exibirAuto: boolean;
  exibirLegenda: boolean;
}
