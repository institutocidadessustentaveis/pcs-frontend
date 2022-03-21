import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { type } from 'os';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-importacao-prefeitura',
  templateUrl: './importacao-prefeitura.component.html',
  styleUrls: ['./importacao-prefeitura.component.css']
})
export class ImportacaoPrefeituraComponent implements OnInit {

  @ViewChild('file') fileInput;
  data: AOA ;
  colunas = [];

  constructor(private service: PrefeituraService) { }

  ngOnInit() {
  }


  public onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer =  (evt.target) as DataTransfer;
    if (target.files.length === 1) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false })) as AOA;

        this.colunas = this.data.slice(0, 1)[0];

        this.data.splice(0, 1);
      };
      reader.readAsBinaryString(target.files[0]);
      this.fileInput.nativeElement.value = '';

    }
  }

  cadastrar() {
    if (this.data != null) {
      const tamanho = this.data.length;
      let quantidade = 0;
      for (const linha of this.data) {
        try {
          const prefeitura: any = {};
          prefeitura.nome =         linha[0] ? linha[0].trim() : '';
          prefeitura.email =        linha[1] ? linha[1].toLowerCase().trim() : '';
          prefeitura.telefone =     this.limparTelefones(linha[2] ? linha[2] : '');
          prefeitura.celular =      this.limparTelefones(linha[3] ? linha[3] : '');
          prefeitura.cargo =        linha[4] ? linha[4].trim() : '';
          prefeitura.ibge =         linha[5] ? linha[5].trim() : '' ;
          prefeitura.partido =      linha[6] ? linha[6].trim() : '';
          prefeitura.receberInfo =  Boolean(linha[7] ? linha[7].toLowerCase().trim() : '');
          prefeitura.signataria =   Boolean(linha[8] ? linha[8].toLowerCase().trim() : '');
          prefeitura.dataInicio =   linha[9] ? linha[9].trim() : '';
          prefeitura.dataFim =      linha[10] ? linha[10].trim() : '';
          prefeitura.arquivo =      linha[11] ? linha[11].trim() : '';

          console.log(prefeitura);
          if (prefeitura.email) {
          this.service.importar(prefeitura).subscribe(res => {
            console.log(`Importou ${prefeitura.nome}`);
            quantidade++;
            if (quantidade == tamanho) {
              alert('terminou');
            }
          }, erro => {
            console.log(`Erro pra importar ${prefeitura.nome}`);
            console.log(erro);
            quantidade++;
            if (quantidade == tamanho) {
              alert('terminou');
            }
          });
        } else {
          console.log(`Sem email  ${prefeitura.nome}`);
          quantidade++;
          if (quantidade == tamanho) {
            alert('terminou');
          }
        }
        } catch (error) {
          console.log(error);
          quantidade++;
          if (quantidade == tamanho) {
            alert('terminou');
          }
        }

      }
    }
  }

  limparTelefones(telefone) {
    if (telefone) {
      const novaString = telefone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '' ).replaceAll(' ', '').trim();
      return novaString;
    } else {
      return '';
    }
  }
}

