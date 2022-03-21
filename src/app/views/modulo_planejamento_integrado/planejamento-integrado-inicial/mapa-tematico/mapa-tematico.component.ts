
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

import * as chroma from 'chroma-js';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { DialogClasseComponent } from './dialog-classe/dialog-classe.component';
import { MapaTematico } from 'src/app/model/mapaTematico';
import { ClasseMapaTematico } from 'src/app/model/classeMapaTematico';
import { MapaTematicoService } from 'src/app/services/mapa-tematico.service';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'ng2-charts';
import { Console } from 'console';

@Component({
  selector: 'app-mapa-tematico',
  templateUrl: './mapa-tematico.component.html',
  styleUrls: ['./mapa-tematico.component.css']
})
export class MapaTematicoComponent implements OnInit {

  @Input() shapesSelecionados: any[];

  @Output() eventoGerarMapa = new EventEmitter();
  
  @Output() eventoRemoverMapa = new EventEmitter();

  form: FormGroup;

  atributos: any[] = [];

  corMinima = '#fffb00';

  corMaxima = '#ff0000';

  displayedColumns: string[] = ['Cor', 'Valor'];

  classes: ClasseMapaTematico[] = [];

  dataSource = new MatTableDataSource<any>();

  public mapaTematicoSelecionado: MapaTematico = new MapaTematico();

  public listaMapaTematico: MapaTematico[] = [];

  valuesIntervalIsEnabled = false;
  minValueInterval: number;
  maxValueInterval: number;



  constructor(public formBuilder: FormBuilder,
              public util: PcsUtil,
              private mapaTematicoService: MapaTematicoService,
              private authService: AuthService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) {
    this.form = this.formBuilder.group({
      camadaSelecionada: [''],
      tipo: ['CATEGORIZADO'],
      atributo: [''],
      cor: [''],
      exibirAuto: [false],
      exibirLegenda:[],
      qtdClasses: [7, [Validators.min(1), Validators.max(100), Validators.maxLength(3)]]
    });
  }

  ngOnInit() {

  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  limparStyle(){
    const selectedLayer = this.form.controls.camadaSelecionada.value;
    if(selectedLayer && selectedLayer.shape){
      this.eventoRemoverMapa.emit(
        {nome: selectedLayer.layerName, layers: selectedLayer.shape.getLayers()});
    }
  }

  gerarMapa() {    
    const selectedLayer = this.form.controls.camadaSelecionada.value;    
    const selectedAttribute = this.form.controls.atributo.value;
    const selectedType = this.form.controls.tipo.value;
    const exibirLegenda = this.form.controls.exibirLegenda.value;
    const colors = this.classes.map((clazz) => clazz.color);
    const values = this.classes.map((clazz) => clazz.value);

    if (selectedType === 'CATEGORIZADO') {

      for (const layer of selectedLayer.shape.getLayers()) {
        const layerJSON = layer.toGeoJSON();
        let properties = null;
        let propertyValue = null;

        if (layerJSON.features) {
          properties = layer.toGeoJSON().features[0].properties;
          propertyValue = properties[selectedAttribute.nome];
        } else if (layer.properties) {
          properties = layer.properties;
          propertyValue = properties[selectedAttribute.nome];
        } else if (layer.options) {
          properties = layer.options;
          propertyValue = properties[selectedAttribute.nome];
        } else {
          properties = {};
        }      
        
        const classes = this.classes.filter((clazz) => clazz.value == propertyValue);
        if (classes.length > 0) {
          const clazz = classes[0];
          layer['oldStyle']=layer.options;
          layer.setStyle({color: clazz.color == undefined ? '#666666' : '#0a0303', fillColor: clazz.color == undefined ? '#c0c3ac' : clazz.color, opacity: 1, fillOpacity: clazz.color == undefined ? 0.4 : 1, weight: clazz.color == undefined ? 4 : 1});
        }
      }
      this.editarExibirLegenda()
      this.eventoGerarMapa.emit(
        {nome: selectedLayer.layerName,
        classes: this.classes,
        exibirLegenda: exibirLegenda});
    }

    if (selectedType === 'GRADUADO') {
      for (const layer of selectedLayer.shape.getLayers()) {

        const layerJSON = layer.toGeoJSON();
        let properties = null;
        let propertyValue = null;

        if (layerJSON.features) {
          properties = layer.toGeoJSON().features[0].properties;
          propertyValue = properties[selectedAttribute.nome];
        } else if (layer.properties) {
          properties = layer.properties;
          propertyValue = properties[selectedAttribute.nome];
        } else if (layer.options) {
          properties = layer.options;
          propertyValue = properties[selectedAttribute.nome];
        } else {
          properties = {};
        }
        const classes = this.classes.filter((clazz) => (propertyValue >= clazz.minimo && propertyValue < (clazz.maximo + 0.00001))  ||  clazz.minimo == undefined );

        if (classes.length > 0) {
          const clazz = classes[0];
          layer['oldStyle']=layer.options;
          layer.setStyle({color: clazz.color == undefined ? '#666666' : '#0a0303', fillColor: clazz.color == undefined ? '#c0c3ac' : clazz.color, opacity: 1, fillOpacity: clazz.color == undefined ? 0.4 : 1, weight: clazz.color == undefined ? 4 : 1});
        }
      }
      this.editarExibirLegenda()
      this.eventoGerarMapa.emit({nome: selectedLayer.layerName,
        classes: this.classes,
        exibirLegenda: exibirLegenda});
    }
  }

  carregarAtributosDaCamadaSelecionada() {

    const camada = this.form.controls.camadaSelecionada.value;
    const tipoMapa = this.form.controls.tipo.value;
    this.classes = [];
    this.atributos = [];
    this.mapaTematicoSelecionado = new MapaTematico();

    if (camada.id) {
      this.buscarMapasTematicos(camada.id);
    }

    for (const layer of camada.shape.getLayers()) {
      const layerJSON = layer.toGeoJSON();
      let properties = null;
      if (layerJSON.features) {
        properties = layer.toGeoJSON().features[0].properties;
      } else if (layer.properties) {
        properties = layer.properties;
      } else if (layer.options) {
        properties = layer.options;
      } else {
        properties = {};
      }
      const propertiesNames = Object.getOwnPropertyNames(properties);
      for (const propertyName of propertiesNames) {
        const propertyValue = properties[propertyName];
        let propertyType = this.verificarTipo(propertyValue) ;
        if (propertyType === 'boolean') {
          propertyType = 'string';
        }
        if (propertyType != 'object') {
          const propertyExists = this.atributos
          .filter((attr) => attr.nome === propertyName &&
                            attr.jsType === propertyType).length > 0;
                   
          if (!propertyExists) {
            const propertyTypeText = propertyType === 'string' ? 'TEXTO' : 'NÚMERO';

            if (tipoMapa === 'CATEGORIZADO' ) {
              if(propertyType !== undefined){
                this.atributos.push({nome: propertyName, tipo: propertyTypeText, jsType: propertyType});             
              } 
            }

            if (tipoMapa === 'GRADUADO' && propertyTypeText === 'NÚMERO') {
              if(propertyType !== undefined){
                this.atributos.push({nome: propertyName, tipo: propertyTypeText, jsType: propertyType});
              }
            }
          }
        }
        
      }
      this.atributos = this.atributos.sort((a,b) => {
        let comparison = 0;
        if (a.nome.toUpperCase()  >  b.nome.toUpperCase()) {
          comparison = 1;
        } else if (a.nome.toUpperCase() <  b.nome.toUpperCase()) {
          comparison = -1;
        }
        return comparison;
      });

    }
    
  }

  gerarClasses() {   
    this.classes = [];

    const classesValues: Array<any> = this.calcularClassesDoAtributo();
    const colors = this.gerarCores(this.corMinima, this.corMaxima, classesValues.length);
    classesValues.forEach(classValue => {      
      if (classValue == undefined) {
        colors[classesValues.indexOf(classValue)] = undefined
      }
      if (classValue != undefined) {
        if (classValue.descricao == 'vazio') {
          colors[classesValues.indexOf(classValue)] = undefined
        }
      }
    })
    const atributoSelecionado = this.form.controls.atributo.value;
    const tipo = this.form.controls.tipo.value;
    if (tipo == 'GRADUADO' ) {
      let i = 0;
      for (const classe of classesValues) {
        classe.color = colors[i];
        classe.value = classe.descricao;
        classe.number = i;
        this.classes.push(classe);
        i++;
      }
    } else {
      let i = 0;
      for (const classValue of classesValues) {  
        const clazz = {number: i, color: colors[i], value: classValue, descricao: '', maximo: null, minimo : null } ;
        this.classes.push(clazz);
        i++;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.classes);
  }

  gerarCoresAletorias() {
    this.classes.forEach((clazz) => {
      clazz.color = chroma.random().hex();
    });
  }

  public _typeof(value) {
    return this.verificarTipo(value);
  }

  private gerarCores(corMinima, corMaxima, numeroClasses) {
    return chroma.scale([corMinima, corMaxima]).mode('lch').colors(numeroClasses);
  }

  private gerarEscalaCor(cores: string[], valores: number[]) {
    return chroma.scale(cores).mode('lch').domain(valores);
  }

  private calcularClassesDoAtributo() {
    const camada = this.form.controls.camadaSelecionada.value;
    const atributoSelecionado = this.form.controls.atributo.value;
    const tipo = this.form.controls.tipo.value;
    if (tipo == 'CATEGORIZADO') {
        return this.calcularClassesDoAtributoTextual(atributoSelecionado, camada);
        
    } else if (tipo == 'GRADUADO') {
        return this.calcularClassesDoAtributoNumericoCategorizada(atributoSelecionado, camada);
    }

  }

  private calcularClassesDoAtributoNumerico(atributoSelecionado: any, camada: any) {
    const values = this.recuperarValoresDoAtributo(atributoSelecionado, camada);
    return this.util.gerarClassesSerieNumerica(values);
  }

  private calcularClassesDoAtributoNumericoCategorizada(atributoSelecionado: any, camada: any) {
    const qtdClasses = this.form.controls.qtdClasses.value;
    const values = this.recuperarValoresDoAtributo(atributoSelecionado, camada);
    if(this.valuesIntervalIsEnabled && this.isNumber(this.minValueInterval) && this.isNumber(this.maxValueInterval)) {
      return this.util.gerarClassesNumerica(values, values.includes(undefined) ? qtdClasses + 1 : qtdClasses, this.minValueInterval, this.maxValueInterval);
    } else {
      return this.util.gerarClassesNumerica(values, values.includes(undefined) ? qtdClasses + 1 : qtdClasses, null, null);
    }
  }

  private calcularClassesDoAtributoTextual(atributoSelecionado: any, camada: any) {
    const values: any = this.recuperarValoresDoAtributo(atributoSelecionado, camada);
    const distinctValues = values.filter((n, i) => values.indexOf(n) === i);
    return distinctValues.sort();
  }

  private recuperarValoresDoAtributo(atributoSelecionado: any, camada: any) {
    const values = [];
    for (const layer of camada.shape.getLayers()) {
      if (layer.toGeoJSON().features) {
        const properties = layer.toGeoJSON().features[0].properties;
        const propertyValue = properties[atributoSelecionado.nome];
        if ((atributoSelecionado.jsType == this.verificarTipo(propertyValue)) || this.verificarTipo(propertyValue) == undefined) {
          values.push(propertyValue);
        }
        
      } else {
        let properties = layer.toGeoJSON().properties;
        if (Object.keys(properties).length == 0) {
          if ( layer.properties) {
            properties = layer.properties;
          } else {
            properties = layer.options;
          }
        }
        const propertyValue = properties[atributoSelecionado.nome];        
        if (propertyValue != undefined && propertyValue != null) {
          values.push(propertyValue);
        }
      }
      
    }
    return values;
  }

  verificarTipo(valor) {
    let tipo = '';
    if (isNaN(valor)) {
      tipo = 'string';
    } else {
      tipo = 'number';
    }
    if (valor == undefined) {
      tipo = undefined
    }
    return tipo;
  }

  dialogNovaClasse() {
    const dialogRef = this.dialog.open(DialogClasseComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const min = Number(result.minimo);
        const max = Number(result.maximo);

        const classe = {
          //descricao: `De ${Number(result.minimo)} até ${Number(result.maximo)}`,
          descricao: `De ${min.toLocaleString('pt-BR')} até ${max.toLocaleString('pt-BR')}`,
          value: `De ${min.toLocaleString('pt-BR')} até ${max.toLocaleString('pt-BR')}`,
          minimo: min,
          maximo: max,
          color: result.cor,
          number: this.classes.length
        }      

        this.classes.push(classe);
        this.dataSource = new MatTableDataSource<any>(this.classes);
      }
    });
  }

  dialogEditarClasse(classe) {
    const dialogRef = this.dialog.open(DialogClasseComponent,{data: classe});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const novaClasse = {
          descricao: `De ${Number(result.minimo).toLocaleString('pt-BR')} até ${Number(result.maximo).toLocaleString('pt-BR')}`,
          value: `De ${Number(result.minimo).toLocaleString('pt-BR')} até ${Number(result.maximo).toLocaleString('pt-BR')}`,
          minimo: Number(result.minimo),
          maximo: Number(result.maximo),
          color: result.cor,
          number : classe.number
        };
        this.classes[classe.number] = novaClasse;

        this.dataSource = new MatTableDataSource<any>(this.classes);
      }
    });
  }

  deletarClasse(classe: ClasseMapaTematico){
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja deletar essa classe?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if(result.value){
        let indexClass = this.classes.indexOf(classe);
        this.classes.splice(indexClass, 1);
  
        this.dataSource = new MatTableDataSource<any>(this.classes);
      }
    }, error => error);
  }

  salvarMapaTematico() {
    const selectedLayer = this.form.controls.camadaSelecionada.value;
    const selectedAttribute = this.form.controls.atributo.value;
    const selectedType = this.form.controls.tipo.value;

    const mapaTematico = new MapaTematico();
    mapaTematico.layerName = selectedLayer.layerName;
    mapaTematico.attributeName = selectedAttribute.nome;
    mapaTematico.nome = this.mapaTematicoSelecionado.nome;
    mapaTematico.type = selectedType;
    mapaTematico.classes = this.classes;
    mapaTematico.idShapeFile  = selectedLayer.id;
    mapaTematico.corMinima = this.corMinima;
    mapaTematico.corMaxima = this.corMaxima;
    mapaTematico.numeroClasses = this.form.controls.qtdClasses.value;
    mapaTematico.exibirAuto = this.form.controls.exibirAuto.value;
    mapaTematico.exibirLegenda = this.form.controls.exibirLegenda.value;

    this.mapaTematicoService.inserirMapaTematico(mapaTematico).subscribe(async response => {
        this.mostrarAlertaMapaTematicoCadastrado();
        this.buscarMapasTematicos(selectedLayer.id);
    });
  }

  private buscarMapasTematicos(idShapeFile: number) {
    if (this.isAuthenticated()) {
      this.mapaTematicoService.buscarMapasTematico(idShapeFile).subscribe(response => {
        
        this.listaMapaTematico = response as Array<MapaTematico>;
      });
    }
  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  public mostrarAlertaMapaTematicoCadastrado() {
    PcsUtil.swal().fire({
      title: 'Mapa Temático',
      text: `Mapa Temático cadastrado`,
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
    }, error => { });
  }

  public onChangeMapaTematico(mapaTematico: MapaTematico){
    
    if (mapaTematico != null && mapaTematico !== undefined) {
      this.mapaTematicoSelecionado = mapaTematico;
      const attributeName: any  = this.atributos.filter(x => x.nome === mapaTematico.attributeName)[0];
      this.form.controls.atributo.setValue(attributeName);
      this.form.controls.tipo.setValue(mapaTematico.type);
      this.form.controls.exibirAuto.setValue(mapaTematico.exibirAuto);
      this.form.controls.exibirLegenda.setValue(mapaTematico.exibirLegenda);
      this.form.controls.qtdClasses.setValue(mapaTematico.numeroClasses);
      this.corMinima = mapaTematico.corMinima;
      this.corMaxima = mapaTematico.corMaxima;
      this.classes = mapaTematico.classes;
      this.dataSource = new MatTableDataSource<any>(this.classes);
    }
  }

  public onExibirAutoChange() {
    let idMapa = this.mapaTematicoSelecionado.id;
    let exibirAuto = this.form.controls.exibirAuto.value;
    let shape = this.form.controls.camadaSelecionada.value;    
    this.mapaTematicoService.editarExibirAuto(idMapa, exibirAuto, shape.id).subscribe(res => {
      this._snackBar.open("Edição de Mapa Concluída.", 'fechar', {
        duration: 4000,
      });
      this.atualizarExibirAuto()
    });
  }

  atualizarExibirAuto(){
    let selectedLayer = this.form.controls.camadaSelecionada.value;
    this.mapaTematicoService.buscarMapasTematico(selectedLayer.id).subscribe(mapas => {
      this.listaMapaTematico.forEach(mp => mp.exibirAuto = false);
      mapas.forEach(mapaRes => {
        if (mapaRes.exibirAuto == true) {
          this.listaMapaTematico.forEach(itemLista => {
            itemLista.id == mapaRes.id ? itemLista.exibirAuto = true : '';
          })
        }
      })
    })
  }

  editarExibirLegenda() {
    let idMapa = this.mapaTematicoSelecionado.id;    
    let exibirLegenda = this.form.controls.exibirLegenda.value;
    
    let shape = this.form.controls.camadaSelecionada.value;  
    if (idMapa) {
      this.mapaTematicoService.editarExibirLegenda(idMapa, exibirLegenda, shape.id).subscribe(res => {
      });
    }    
  }

  // public onExibirLegendaChange() {
  //   if (this.mapaTematicoSelecionado.id) {
  //     this.editarExibirLegenda()
  //   }
  // }

  public excluirMapaTematico(idMapaTematico: number): void {
    const selectedLayer = this.form.controls.camadaSelecionada.value;
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o mapa Temático selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.mapaTematicoService.excluirMapaTematico(idMapaTematico).subscribe(response => {
          PcsUtil.swal().fire('Excluído!', `Mapa Temático excluído.`, 'success');
          this.buscarMapasTematicos(selectedLayer.id);
          this.mapaTematicoSelecionado = new MapaTematico();
        });
      }
    });
  }

  public limparFiltroMapaTematico() {
    this.mapaTematicoSelecionado = new MapaTematico();
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
