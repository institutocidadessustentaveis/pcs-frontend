import { PedidoAprovacaoPrefeitura } from 'src/app/model/pedido-aprovacao-prefeitura';
import { Usuario } from './usuario';
export class EmailToken {
    id: number;
    ativo: boolean;
    hash: string;
    funcionalidade: string;
    aprovacaoPrefeitura: PedidoAprovacaoPrefeitura;
    usuario: Usuario;
}
