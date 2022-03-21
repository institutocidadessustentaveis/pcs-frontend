import { ItemCombo } from './ItemCombo ';

export class FiltroCidadesComBoasPraticas {
  page?: number;
  linesPerPage?: number;
  continente?: string;
  idPais?: number;
  pais: ItemCombo;
  cidade: ItemCombo;
  idEstado?: number;
  estado: ItemCombo;
  idCidade?: number;
  idEixo?: number;
  idOds?: number;
  idMetaOds?: number;
  metaOds: ItemCombo;
  popuMin?: number;
  popuMax?: number;
  idIndicador?: number;
  visualizarComoPontos = true;
  nomeConsulta?: string;
  idConsulta?: number;
  palavraChave?: string;
}
