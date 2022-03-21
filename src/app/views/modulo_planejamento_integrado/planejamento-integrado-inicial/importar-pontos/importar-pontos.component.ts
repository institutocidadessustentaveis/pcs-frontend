import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';
import { Arquivo } from 'src/app/model/arquivo';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { LatLong } from 'src/app/model/lat-long';
import { PcsUtil } from 'src/app/services/pcs-util.service';

type AOA = any[][];

@Component({
  selector: 'app-importar-pontos',
  templateUrl: './importar-pontos.component.html',
  styleUrls: ['./importar-pontos.component.css']
})
export class ImportarPontosComponent implements OnInit {

  @Output() carregarNoMapaEvent = new EventEmitter();

  @Output() removerNoMapaEvent = new EventEmitter();

  @ViewChild('file') fileInput;

  private pontosImportados: LatLong[] = [];
  data: AOA = [];

  constructor() { }

  ngOnInit() {
  }

  public onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
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
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

        let colunas = this.data.slice(0, 1)[0];

        let colunaLatValida = false;
        let colunaLngValida = false;
        let atributosValidos = true;

        if (colunas[0].toUpperCase() === 'LATITUDE' || colunas[0].toUpperCase() === 'LAT' ) {
          colunaLatValida = true;
        }
        if (colunas[1].toUpperCase() === 'LONGITUDE' || colunas[1].toUpperCase() === 'LON' || colunas[1].toUpperCase() === 'LNG' || colunas[1].toUpperCase() === 'LGT' ) {
          colunaLngValida = true;
        }

        for (let i = 2; i < colunas.length; i++) {
          if (colunas[i].length > 10 ) {
            atributosValidos = false;
          }
        }
        if (colunaLatValida && colunaLngValida && atributosValidos) {
          this.data.splice(0, 1);
          this.data.forEach(element => {
            const atributos: any = {};
            for (let i = 2; i < colunas.length; i++) {
              atributos[colunas[i]] = element[i];
              atributos.latitude = element[0];
              atributos.longitude = element[1];
            }
            this.pontosImportados.push(new LatLong(element[0], element[1], atributos));
          });
          this.carregarNoMapaEvent.emit(this.pontosImportados);
        } else {
          if (atributosValidos) {
            PcsUtil.swal().fire('Arquivo inválido', 'Por favor, adeque seu arquivo.<br>A primeira coluna deve ter o nome: Latitude, seguido de seus respectivos valores.<br> A segunda coluna deve ter o nome Longitude, seguido de seus respectivos valores.', 'warning');
          } else {
            PcsUtil.swal().fire('Arquivo inválido', 'Por favor, adeque seu arquivo.<br>Existem atributos com mais de 10 caracteres.', 'warning');
          }
        }
      };
      reader.readAsBinaryString(target.files[0]);
      this.fileInput.nativeElement.value = '';
      this.pontosImportados = [];
      this.data = [];

    }
  }

  public removerPontosImportados() {
    this.removerNoMapaEvent.emit();
  }

}
