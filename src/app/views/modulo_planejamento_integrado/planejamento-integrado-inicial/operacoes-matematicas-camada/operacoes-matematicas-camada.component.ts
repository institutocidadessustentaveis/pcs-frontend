import { Component, OnInit, Input, SimpleChanges,OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';


@Component({
  selector: 'app-operacoes-matematicas-camada',
  templateUrl: './operacoes-matematicas-camada.component.html',
  styleUrls: ['./operacoes-matematicas-camada.component.css']
})
export class OperacoesMatematicasCamadaComponent implements OnInit, OnChanges {

  @Input() shapesSelecionados: any[];

  @Input() shapesSelecionadosPorSelecaoArea: any[];

  form: FormGroup;

  atributos: any[] = [];

  nomeOperacaoEfetuada: string;

  resultado: any;

  constructor(public formBuilder: FormBuilder,
              public pcsUtil: PcsUtil) {
    this.form = this.formBuilder.group({
      camadaSelecionada: [""],
      atributo: [''],
      operacao: ['']
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    this.carregarAtributosDaCamadaSelecionadosNoMapa();

    this.form.controls.camadaSelecionada.setValue('');
    this.form.controls.atributo.setValue('');
    this.form.controls.operacao.setValue('');
    this.nomeOperacaoEfetuada = '';
    this.form.controls.operacao.setValue('');
  }

  carregarAtributosDaCamadaSelecionadosNoMapa() {

    this.atributos = [];
    if (this.shapesSelecionadosPorSelecaoArea && this.shapesSelecionadosPorSelecaoArea.length > 0) {
      for (let layer of this.shapesSelecionadosPorSelecaoArea) {
        let geoJson = layer.toGeoJSON();
        geoJson.properties = layer.options;
        let properties = geoJson.properties;
        let propertiesNames = Object.getOwnPropertyNames(properties);

        for(let propertyName of propertiesNames) {
          let propertyValue = properties[propertyName];
          // let propertyType = typeof(propertyValue);
          let isNumber = this.isNumber(propertyValue);
          let propertyType;
          if (isNumber) {
            propertyType = 'number';
          } else {
            propertyType = 'string';
          }
          let propertyExists = this.atributos
                                      .filter((attr) => attr['nome'] === propertyName && 
                                                        attr['jsType'] === propertyType).length > 0

          if (!propertyExists) {
            let propertyTypeText = propertyType === "string" ? "TEXTO" : "NÚMERO";

            if (propertyTypeText === 'NÚMERO') {
              this.atributos.push({'nome': propertyName, 'tipo': propertyTypeText, 'jsType': propertyType});
            }
          }
        }
      }
    }
  }

  carregarAtributosDaCamadaSelecionada() {
    let camada = this.form.controls.camadaSelecionada.value;

    this.atributos = [];

    for(let layer of camada.shape.getLayers()) {
      let geoJson = layer.toGeoJSON();  
      for (let feature of geoJson.features) {
        let properties = feature.properties
        let propertiesNames = Object.getOwnPropertyNames(properties);

        for(let propertyName of propertiesNames) {
          let propertyValue = properties[propertyName];
          let isNumber = this.isNumber(propertyValue);
          let propertyType;
          if (isNumber) {
            propertyType = 'number';
          }else{
            propertyType = 'string';
          }
          let propertyExists = this.atributos
                                      .filter((attr) => attr['nome'] === propertyName && 
                                                        attr['jsType'] === propertyType).length > 0

          if(!propertyExists) {
            let propertyTypeText = propertyType === "string" ? "TEXTO" : "NÚMERO";

            if(propertyTypeText === 'NÚMERO') {
              this.atributos.push({'nome': propertyName, 'tipo': propertyTypeText, 'jsType': propertyType});
            }
          }
        }
      }
    }
  }

  private isNumber(value: string | number): boolean{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
  }

  efetuarOperacao() {
    let operacao = this.form.controls.operacao.value;

    if(operacao === 'SOMA') {
      this.nomeOperacaoEfetuada = 'Soma';
      this.resultado = this.somarAtributoSelecionado();
    }

    if(operacao === 'MÉDIA') {
      this.nomeOperacaoEfetuada = 'Média';
      this.resultado = this.calcularMediaAtributoSelecionado();
    }

    if(operacao === 'MODA') {
      this.nomeOperacaoEfetuada = 'Moda';
      let moda = this.calcularModaAtributoSelecionado();
      if(moda.length > 1 && moda.length <= 3) {
        this.resultado = ''
        moda.forEach(moda => 
          this.resultado += ` ${parseFloat(moda).toFixed(2)} |`
          );
      }
      else if(moda.length == 1) {
        this.resultado = ''
        moda.forEach(moda =>
          this.resultado += `${parseFloat(moda).toFixed(2)}`
          );
      }
      else {
        this.resultado = "Essa camada não possui moda";
      }
    }

    if(operacao === 'MEDIANA') {
      this.nomeOperacaoEfetuada = 'Mediana';
      this.resultado = this.calcularMedianaAtributoSelecionado();
    }

    if(operacao === "DESVIO PADRÃO") {
      this.nomeOperacaoEfetuada = 'Desvio padrão';
      this.resultado = this.calcularDesvioPadraoAtributoSelecionado();
    }
  }

  somarAtributoSelecionado() {
    let layers = null;
    const selectedLayer = this.form.controls.camadaSelecionada.value;
    if (selectedLayer) {
      layers = selectedLayer.shape.getLayers();
    } else {
      layers = this.shapesSelecionadosPorSelecaoArea;
    }
    let selectedAttribute = this.form.controls.atributo.value;
    let result: number = 0;

    for(let layer of layers) {
      let geoJson = layer.toGeoJSON();
      geoJson.properties = layer.options;

      let properties;
      if(geoJson.features && geoJson.features[0].properties){
        properties = geoJson.features[0].properties;
      }else{
        properties =  geoJson.properties;
      }
    
      let propertyValue = Number(properties[selectedAttribute.nome]);

      if(!isNaN(propertyValue)) {
        result = result + propertyValue;
      }
    }

    return result;
  }

  calcularMediaAtributoSelecionado() {
    let selectedLayer = this.form.controls.camadaSelecionada.value;

    let sum: number = this.somarAtributoSelecionado();
    let layers = null;
    if (selectedLayer) {
      layers = selectedLayer.shape.getLayers();
    } else {
      layers = this.shapesSelecionadosPorSelecaoArea;
    }

    let length = this.calcularLengthAtributoSelecionado();

    let mean: number = 0;
    if(length) {
      mean = sum / length;
    }
    return mean;
  }

  calcularLengthAtributoSelecionado() {
      let layers = null;
      const selectedLayer = this.form.controls.camadaSelecionada.value;
      if (selectedLayer) {
        layers = selectedLayer.shape.getLayers();
      } else {
        layers = this.shapesSelecionadosPorSelecaoArea;
      }
      let selectedAttribute = this.form.controls.atributo.value;
      let result: number = 0;
  
      for(let layer of layers) {
        let geoJson = layer.toGeoJSON();
        geoJson.properties = layer.options;
  
        let properties;
        if(geoJson.features && geoJson.features[0].properties){
          properties = geoJson.features[0].properties;
        }else{
          properties =  geoJson.properties;
        }
      
        let propertyValue = Number(properties[selectedAttribute.nome]);
        if(!isNaN(propertyValue) && propertyValue !== null && propertyValue != undefined) {
          result = result + 1;
        }
      }
      return result;
  }

  calcularModaAtributoSelecionado() {
    let selectedLayer = this.form.controls.camadaSelecionada.value;
    let selectedAttribute = this.form.controls.atributo.value;
    let series: number[] = [];

    let layers = null;
    if (selectedLayer) {
      layers = selectedLayer.shape.getLayers();
    } else {
      layers = this.shapesSelecionadosPorSelecaoArea;
    }

    for(let layer of layers) {
      let geoJson = layer.toGeoJSON();
      geoJson.properties = layer.options;

      let properties;
      if(geoJson.features && geoJson.features[0].properties){
        properties = geoJson.features[0].properties;
      }else{
        properties =  geoJson.properties;
      }
    
      let propertyValue = Number(properties[selectedAttribute.nome]);
      if(!isNaN(propertyValue)) {
        series.push(propertyValue);
      }
    }
    return this.pcsUtil.mode(series);
  }

  calcularMedianaAtributoSelecionado() {
    let selectedLayer = this.form.controls.camadaSelecionada.value;
    let selectedAttribute = this.form.controls.atributo.value;
    let series: number[] = [];

    let layers = null;
    if (selectedLayer) {
      layers = selectedLayer.shape.getLayers();
    } else {
      layers = this.shapesSelecionadosPorSelecaoArea;
    }

    for(let layer of layers) {

      let geoJson = layer.toGeoJSON();
      geoJson.properties = layer.options;

      let properties;
      if(geoJson.features && geoJson.features[0].properties){
        properties = geoJson.features[0].properties;
      }else{
        properties =  geoJson.properties;
      }
    
      let propertyValue = Number(properties[selectedAttribute.nome]);

      if(!isNaN(propertyValue)) {
        series.push(propertyValue);
      }
    }

    return this.pcsUtil.calcularMediana(series);
  }

  calcularDesvioPadraoAtributoSelecionado() {
    let selectedLayer = this.form.controls.camadaSelecionada.value;
    let selectedAttribute = this.form.controls.atributo.value;
    let series: number[] = [];

    let layers = null;
    if (selectedLayer) {
      layers = selectedLayer.shape.getLayers();
    } else {
      layers = this.shapesSelecionadosPorSelecaoArea;
    }

    for(let layer of layers) {

      let geoJson = layer.toGeoJSON();
      geoJson.properties = layer.options;

      let properties;
      if(geoJson.features && geoJson.features[0].properties){
        properties = geoJson.features[0].properties;
      }else{
        properties =  geoJson.properties;
      }
    
      let propertyValue = Number(properties[selectedAttribute.nome]);

      if(!isNaN(propertyValue)) {
        series.push(propertyValue);
      }
    }

    return this.pcsUtil.calcularDesvioPadrao(series);
  }

}
