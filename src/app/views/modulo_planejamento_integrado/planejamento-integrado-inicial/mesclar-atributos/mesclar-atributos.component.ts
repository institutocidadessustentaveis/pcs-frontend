import { AuthService } from 'src/app/services/auth.service';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-mesclar-atributos',
  templateUrl: './mesclar-atributos.component.html',
  styleUrls: ['./mesclar-atributos.component.css']
})
export class MesclarAtributosComponent implements OnInit {
  @Input() idShape;
  @Input() idPrefeitura;

  @Output() configurarAtributosEvent = new EventEmitter()

  arquivo = null;
  data: AOA = [];
  habilitarBotao = false;
  public loading = false;
  constructor(private shapeFileService: ShapeFileService, private authService: AuthService) {}

  ngOnInit() {
    this.habilitarBotao = this.podeHabilitarBotao();
  }

  podeHabilitarBotao(): boolean {
    if (this.authService.hasRole('ROLE_MESCLAR_ATRIBUTOS')) {
      if (this.idPrefeitura){
        if (this.authService.isAuthenticated() && this.authService.isUsuarioPrefeitura()){
          const usuarioLogado: any = JSON.parse(this.authService.getUsuarioLogado());
          if (this.idPrefeitura == usuarioLogado.dadosPrefeitura.id) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else if (this.authService.hasPerfil('Administrador')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
  lerArquivo(file) {
    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as AOA;
      const colunas = this.data.slice(0, 1)[0];
      this.geraOpcoes(colunas);
    };
    reader.readAsBinaryString(file);
    this.arquivo = file;
  }

  geraOpcoes(colunas) {
    const select: any = document.getElementsByName('select' + this.idShape);
    for (const item of select) {
      for (const coluna of colunas) {
        if (item.nodeName === 'SELECT') {
          const opt = document.createElement('option');
          opt.appendChild(document.createTextNode(coluna));
          opt.value = coluna;
          item.appendChild(opt);
        }
      }
    }
  }

  geraMatrizDeDados(file, valor) {
    this.loading = true;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as AOA;
      const colunas = this.data.slice(0, 1)[0];
      const mesclagem: any = {
        idShape: this.idShape,
        dados: this.data,
        atributo: valor,
        colunas
      };
      this.shapeFileService.mesclarAtributos(mesclagem).subscribe(
        response => {
          if (response == 1) {
            PcsUtil.swal().fire('Importação realizada com sucesso', `${response} objeto foi atualizado`, 'success');
          } else {
            this.configurarAtributosEvent.emit()
            PcsUtil.swal().fire('Importação realizada com sucesso', `${response} objetos foram alterados`, 'success');
          }
          this.loading = false;
        }
      );
    };
    reader.readAsBinaryString(file);
  }


  botaoMesclar() {
    PcsUtil.swal()
      .mixin({
        input: 'text',
        showCancelButton: true,
        progressSteps: ['1', '2']
      })
      .queue([
        {
          title: 'Escolha o arquivo que  deseja importar.',
          text: 'O arquivo deve ser do tipo Xls ou Xlsx.',
          input: 'file',
          inputAttributes: {
            accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
            'aria-label': 'Upload your profile picture'
          },
          confirmButtonText: 'Avançar →',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: file => {
            this.lerArquivo(file);
          }
        },
        {
          title: 'Escolha o atributo de referência.',
          text: 'O arquivo deve ser do tipo Xls ou Xlsx.',
          input: 'select',
          inputAttributes: { name: `select${this.idShape}` },
          confirmButtonText: 'Importar Arquivo',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: valor => {
            this.geraMatrizDeDados(this.arquivo, valor);

          }
        }
      ]);
    //
  }
}
