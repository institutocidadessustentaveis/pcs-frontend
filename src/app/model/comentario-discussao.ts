import { ForumDiscussao } from './forum-discussao';
import { Usuario } from './usuario';

export class comentarioDiscussao {
    id: number;
    discussao: number;
    usuario: number;
    nomeUsuario: String;
    comentario: String;
    dataPublicacao: any;
    horarioPublicacao: any;
    editado: boolean;
    dataEdicao: any;
    horarioEdicao: any;

    //comentarioFilho
    comentarioPai: number;
}