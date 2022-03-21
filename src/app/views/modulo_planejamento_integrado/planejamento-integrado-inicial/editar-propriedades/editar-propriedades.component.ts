import { color } from 'html2canvas/dist/types/css/types/color';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeafletUtilService } from 'src/app/services/leaflet-util.service';

@Component({
  selector: 'app-editar-propriedades',
  templateUrl: './editar-propriedades.component.html',
  styleUrls: ['./editar-propriedades.component.css']
})
export class EditarPropriedadesComponent implements OnInit {
  public style = {
    color: '#3388ff',
    fillColor: null,
    fillOpacity: 0.2,
    opacity: 0.5,
    stroke: true,
    weight: 4,
    dashArray: null,
    dashOffset: null
  };

  tipoLinha = '';

  constructor(
    private leafletUtil: LeafletUtilService,
    public dialogRef: MatDialogRef<EditarPropriedadesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (!this.data.layer) {
      this.style.color =  this.data.obj.options.color;
      this.style.fillColor = this.data.obj.options.fillColor;
      this.style.fillOpacity = this.data.obj.options.fillOpacity;
      this.style.opacity = this.data.obj.options.opacity;
      this.style.stroke = this.data.obj.options.stroke;
      this.style.weight = this.data.obj.options.weight;
      this.style.dashArray = this.data.obj.options.dashArray;
      this.style.dashOffset = this.data.obj.options.dashOffset;
      if(this.data.obj.options){
        this.data.obj.options.dashOffset == '20' ? this.tipoLinha = 'stripped' : '';
        this.data.obj.options.dashOffset == '1' ? this.tipoLinha = 'points' : '';
        this.data.obj.options.dashOffset == null || this.data.obj.options.dashOffset == undefined ? this.tipoLinha = 'continua' : '';
      }
    } else {
      if (this.data.obj && ( this.leafletUtil.getLayerType(this.data.obj.getLayers()[0]) === 'marker' ||
      this.leafletUtil.getLayerType(this.data.obj.getLayers()[0]) === 'circle' ||
      this.leafletUtil.getLayerType(this.data.obj.getLayers()[0]) === 'circlemarker' )) {
        this.style.color =  this.data.obj.getLayers()[0].options.color;
        this.style.fillColor = this.data.obj.getLayers()[0].options.fillColor;
        this.style.fillOpacity = this.data.obj.getLayers()[0].options.fillOpacity;
        this.style.opacity = this.data.obj.getLayers()[0].options.opacity;
        this.style.stroke = this.data.obj.getLayers()[0].options.stroke;
        this.style.weight = this.data.obj.getLayers()[0].options.weight;

      } else {
        if (this.data.obj.getLayers()[0]._layers) {
          if (this.data.obj.getLayers()[0].getLayers()[0] && this.data.obj.getLayers()[0].getLayers()[0].options) {
            this.style.color =  this.data.obj.getLayers()[0].getLayers()[0].options.color;
            this.style.fillColor = this.data.obj.getLayers()[0].getLayers()[0].options.fillColor;
            this.style.fillOpacity = this.data.obj.getLayers()[0].getLayers()[0].options.fillOpacity;
            this.style.opacity = this.data.obj.getLayers()[0].getLayers()[0].options.opacity;
            this.style.stroke = this.data.obj.getLayers()[0].getLayers()[0].options.stroke;
            this.style.weight = this.data.obj.getLayers()[0].getLayers()[0].options.weight;
            this.style.dashArray = this.data.obj.getLayers()[0].getLayers()[0].options.dashArray;
            this.style.dashOffset = this.data.obj.getLayers()[0].getLayers()[0].options.dashOffset;
            if(this.data.obj.getLayers()[0].getLayers()[0].options){
              this.data.obj.getLayers()[0].getLayers()[0].options.dashOffset == '20' ? this.tipoLinha = 'stripped' : '';
              this.data.obj.getLayers()[0].getLayers()[0].options.dashOffset == '1' ? this.tipoLinha = 'points' : '';
              this.data.obj.getLayers()[0].getLayers()[0].options.dashOffset == null || this.data.obj.getLayers()[0].getLayers()[0].options.dashOffset == undefined ? this.tipoLinha = 'continua' : '';
            }
          }
        } else{
          if (this.data.obj.getLayers()[0].options) {
            this.style.color =  this.data.obj.getLayers()[0].options.color;
            this.style.fillColor = this.data.obj.getLayers()[0].options.fillColor;
            this.style.fillOpacity = this.data.obj.getLayers()[0].options.fillOpacity;
            this.style.opacity = this.data.obj.getLayers()[0].options.opacity;
            this.style.stroke = this.data.obj.getLayers()[0].options.stroke;
            this.style.weight = this.data.obj.getLayers()[0].options.weight;
            this.style.dashArray = this.data.obj.getLayers()[0].options.dashArray;
            this.style.dashOffset = this.data.obj.getLayers()[0].options.dashOffset;
            if(this.data.obj.getLayers()[0].options){
              this.data.obj.getLayers()[0].options.dashOffset == '20' ? this.tipoLinha = 'stripped' : '';
              this.data.obj.getLayers()[0].options.dashOffset == '1' ? this.tipoLinha = 'points' : '';
              this.data.obj.getLayers()[0].options.dashOffset == null || this.data.obj.getLayers()[0].options.dashOffset == undefined ? this.tipoLinha = 'continua' : '';
            }
          }
        }

      }
    }

  }

  public adicionarAtributo() {
    this.data.propriedades.push('');
  }

  public isLine(){
    let retorno = false;

    if(this.data.obj.layerType){
      if(this.data.obj.layerType == 'polyline'){
        retorno = true;
      }
    }

    if(this.data.obj.properties){
      if(this.data.obj.properties.layerType == "LineString"){
        retorno = true;
      }
    }

    if (this.data.layer) {
      if (this.data.obj.getLayers()[0]._layers) {
        if (this.data.obj.getLayers()[0].getLayers()[0] && this.data.obj.getLayers()[0].getLayers()[0].options) {
          retorno = true;
        }
      } else {
        if (this.data.obj.getLayers()[0].options && this.data.obj.getLayers()[0].options.layerType) {
          retorno = true;
        }
      }
    }

    return retorno;
  }

  public removerAtributo(index: number) {
    this.data.propriedades.splice(index, 1);
  }

  public salvar() {
    if (!this.data.layer) {
      if (this.tipoLinha == 'stripped') {
        let styleStripped = this.style;
        styleStripped.dashArray = '20, 20';
        styleStripped.dashOffset = '20';
      }
      if (this.tipoLinha == 'points') {
        let styleStripped = this.style;
        styleStripped.dashArray = '0, 5';
        styleStripped.dashOffset = '1';
      }
      if (this.tipoLinha == 'continua') {
        let styleStripped = this.style;
        styleStripped.dashArray = null;
        styleStripped.dashOffset = null;
      }
      this.data.obj.setStyle(this.style);
    } else {
      for (const layer of this.data.obj.getLayers()) {
        if (this.tipoLinha == 'stripped') {
          let styleStripped = this.style;
          styleStripped.dashArray = '20, 20';
          styleStripped.dashOffset = '20';
        }
        if (this.tipoLinha == 'points') {
          let styleStripped = this.style;
          styleStripped.dashArray = '0, 10';
          styleStripped.dashOffset = '1';
        }
        if (this.tipoLinha == 'continua') {
          let styleStripped = this.style;
          styleStripped.dashArray = null;
          styleStripped.dashOffset = null;
        }
         layer.setStyle(this.style);
      }
    }

    this.dialogRef.close(null);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

}
