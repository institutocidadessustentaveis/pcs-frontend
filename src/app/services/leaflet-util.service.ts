import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import * as SW from '@aleffabricio/shp-write';
import * as turf from '@turf/turf';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class LeafletUtilService {


  constructor() { }

  getDrawOptions(editableFeatureGroup) {
    const options = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#3388ff'
          }
        },
        circle: {
          shapeOptions: {
            color: '#3388ff'
          }
        },
        polygon: {
          shapeOptions: {
            color: '#3388ff'
          }
        },
        rectangle:  {
          shapeOptions: {
            color: '#3388ff'
          }
        }
      },
      edit: {
        featureGroup: editableFeatureGroup,
        remove: {},
        edit: {
          selectedPathOptions: {
            stroke: false,
            color: '#e10010',
            weight: 500
          }
        }
      }
    };
    return options;
  }

  getLayerType(object) {
    if (object._mRadius) {
      return 'circle';
    } else if (object._latlng) {
      if (object._radius) {
        return 'circlemarker';
      } else {
        return 'marker';
      }
    } else if (object.properties && object.properties.layerType && object.properties.layerType == 'LineString') {
        return 'LineString';
    }
    if(object._layers){
      const _indicesLayer = Object.getOwnPropertyNames(object._layers);
      if(_indicesLayer.length > 1){
        return 'MultiPolygon';
      } else {
        if (object._layers[_indicesLayer[0]] &&  object._layers[_indicesLayer[0]]._latlngs && Array.isArray(object._layers[_indicesLayer[0]]._latlngs[0][0])) {
          return 'MultiPolygon';
        }
      }
    }
    return 'polygon';
  }

  toGeoJSON(object) {
    let layer: any = {};
    let tipoObjeto = '';
    let propriedades = {};
    if (!object) {
      return null;
    }
    if (object.layer) {
      layer = object.layer;
      tipoObjeto = object.layerType;
    } else {
      layer = object;
      if (( object.options && object.options.layerType === 'MultiPolygon') || (object.feature && object.feature.geometry.type == 'MultiPolygon')) {
        tipoObjeto = 'MultiPolygon';
      } else if (object.layerType && object.layerType === 'polyline') {
        tipoObjeto = 'polyline';
      } else if (object.properties && object.properties.layerType === 'LineString') {
        tipoObjeto = 'LineString';
      } else {
        tipoObjeto = this.getLayerType(object);
      }
    }
    let returnObject: any = {};
    const coordenadas = [];
    switch (tipoObjeto) {
      case 'rectangle':
        if (layer._latlngs) {
          layer._latlngs[0].forEach(latLng => {
            coordenadas.push([latLng.lng, latLng.lat]);
          });
          coordenadas.push(coordenadas[0]);
        } else {
          const _indicesLayer = Object.getOwnPropertyNames(layer._layers);

          try{
            layer._layers[_indicesLayer[0]]._latlngs[0].forEach(latLng => {
              coordenadas.push([latLng.lng, latLng.lat]);
            });
          }catch(e){
            layer._layers[_indicesLayer[0]]._latlngs.forEach(latLng => {
              coordenadas.push([latLng.lng, latLng.lat]);
            });
          }

          coordenadas.push(coordenadas[0]);
        }
        while (coordenadas.length < 4) {
          coordenadas.push(coordenadas[0]);
        }
        returnObject = turf.polygon([coordenadas]);
        break;

      case 'polyline':
      case 'LineString':
        if (layer._latlngs) {
          layer._latlngs.forEach(latLng => {
            coordenadas.push([latLng.lng, latLng.lat]);
          });
        }
        returnObject = turf.lineString(coordenadas);
        break;

      case 'polygon':
        if (layer._latlngs) {
          layer._latlngs[0].forEach(latLng => {
            coordenadas.push([latLng.lng, latLng.lat]);
          });
          coordenadas.push(coordenadas[0]);
        } else {
          const _indicesLayer = Object.getOwnPropertyNames(layer._layers);
          layer._layers[_indicesLayer[0]]._latlngs[0].forEach(latLng => {
            coordenadas.push([latLng.lng, latLng.lat]);
          });
          coordenadas.push(coordenadas[0]);
        }
        while (coordenadas.length < 4) {
          coordenadas.push(coordenadas[0]);
        }
        returnObject = turf.polygon([coordenadas]);
        break;
      case 'MultiPolygon':
        if (layer._latlngs) {
          for(let item of layer._latlngs){
            let lista = [];
            const arrayDeCoordenadas = item[0];
            for (const coordenada of arrayDeCoordenadas ) {
              lista.push(coordenada);
            }
            while (lista.length < 4) {
              lista.push(lista[0]);
            }
            coordenadas.push(lista);
          }
          // let lista = layer._latlngs[0];
          // lista[0].forEach(latLng => {
          //   coordenadas.push([latLng.lng, latLng.lat]);
          // });
          // coordenadas.push(coordenadas[0]);
        } else {
          const _indicesLayer = Object.getOwnPropertyNames(layer._layers);
          if(layer._layers[_indicesLayer[0]].feature) {
            returnObject = layer._layers[_indicesLayer[0]].feature;
          }
          layer._layers[_indicesLayer[0]]._latlngs[0].forEach(latLng => {
            if (latLng.lng && latLng.lat) {
              coordenadas.push([latLng.lng, latLng.lat]);
            } else {
              latLng.forEach(ll => {
                coordenadas.push([ll.lng, ll.lat]);
              });
            }
          });
          coordenadas.push(coordenadas[0]);
          while (coordenadas.length < 4) {
            coordenadas.push(coordenadas[0]);
          }
        }
        if(!returnObject.geometry) {
          returnObject = turf.multiPolygon([coordenadas]);
        }
        break;
      case 'circle':
        const radius = layer._mRadius;
        const options = { steps: 100, units: 'kilometers', options: {} };
        returnObject = turf.circle([layer._latlng.lng, layer._latlng.lat], radius / 1000, {});
        break;

      case 'circlemarker':
        returnObject = turf.point([layer._latlng.lng, layer._latlng.lat]);
        break;
      case 'marker':
        returnObject = turf.point([layer._latlng.lng, layer._latlng.lat]);
        break;

      default:
        break;
    }
    try {
      if (layer && layer._layers != null ) {
        const _indicesLayer = Object.getOwnPropertyNames(layer._layers);
        propriedades = layer._layers[_indicesLayer[0]].feature.properties;
      } else if (layer.properties) {
        propriedades = layer.properties;
      } else if (layer.feature && layer.feature.properties) {
        propriedades = layer.feature.properties;
      } else if (layer.options) {
        propriedades = layer.options;
      } else {
        propriedades = null;
      }
    } catch (e) {
      propriedades = null;
    }


    if (propriedades) {
      returnObject.properties = propriedades;
    }
    return returnObject;
  }

  isOverlapWithIntersecting(geoJSON1, geoJSON2) {
    let result = false ;
    try {
      result =  turf.booleanContains(geoJSON1, geoJSON2);
      if (!result) {
        result = turf.booleanContains(geoJSON2, geoJSON1);
      }
    } catch (error) { }
    try {
      if (!result) {
        result =  turf.booleanWithin(geoJSON1, geoJSON2);
      }
      if (!result) {
        result = turf.booleanWithin(geoJSON2, geoJSON1);
      }
    } catch (error) { }

    try {
      if (!result) {
        result =  turf.booleanOverlap(geoJSON1, geoJSON2);
      }
      if (!result) {
        result = turf.booleanOverlap(geoJSON2, geoJSON1);
      }
    } catch (error) { }

    try {
      if (!result) {
        result =  turf.booleanCrosses(geoJSON1, geoJSON2);
      }
      if (!result) {
        result = turf.booleanCrosses(geoJSON2, geoJSON1);
      }
    } catch (error) { }

    try {
      if (!result) {
        result =  turf.booleanPointInPolygon(geoJSON1, geoJSON2);
      }
      if (!result) {
        result = turf.booleanPointInPolygon(geoJSON2, geoJSON1);
      }
    } catch (error) {
      try {
        if (!result) {
          result = turf.booleanPointInPolygon(geoJSON2, geoJSON1);
        }
      } catch (error) { }
    }

    try {
      if (!result) {
        const obj =  turf.intersect(geoJSON1, geoJSON2);
        if (obj != null) {
          result = true;
        }
      }
      if (!result) {
        const obj = turf.intersect(geoJSON2, geoJSON1);
        if (obj != null) {
          result = true;
        }
      }
    } catch (error) { }

    return result;
  }

  criarEExportarShapeFile(listaFeatures: any[]) {
    const featureGroup = turf.featureCollection(listaFeatures);
    const options = {
      folder: 'Camadas',
      types: {
        point: 'points',
        polygon: 'polygons',
        line: 'lines'
      }
    };

    SW.download(featureGroup, options);
  }

  duplicarAtributos(listaFeatures) {
    const propriedadesExtraidas = listaFeatures.map(f => f.properties ? (Object.keys(f.properties)) : [''] );
    let propriedades: any = [];
    propriedadesExtraidas.forEach(a => {
      propriedades = propriedades.concat(a);
    });
    propriedades = new Set(propriedades);
    for (const feature of listaFeatures) {

      propriedades.forEach(propriedade => {
        if (!feature.properties) {
          feature.properties = {};
        }
        if (feature.properties && !feature.properties.hasOwnProperty(propriedade)) {
          if (propriedade.trim() != '') {
            feature.properties[propriedade + ''] = null;
          }
        }
      });
    }


  }

  definirAtributosNulos(listaFeatures) {
    for (const feature of listaFeatures) {
      if ( feature.properties ) {
        const keys = Object.keys(feature.properties);
        for (const key of keys) {
          if ( feature.properties[key] === undefined ) {
            feature.properties[key] = null;
          }
        }
      }
    }
  }

  mesclarObjetos(listaObjetos) {
    let objetoMesclado = null;
    if (listaObjetos == null || listaObjetos == undefined) {
      return null;
    }
    if (listaObjetos.length > 1) {
      for (let i = 0 ; i < listaObjetos.length ; i++) {
        if (i == 0) {
          objetoMesclado = !listaObjetos[i].geometry ? this.toGeoJSON(listaObjetos[i]) : listaObjetos[i] ;
        } else {
          let objetoParaMesclar = !listaObjetos[i].geometry ? this.toGeoJSON(listaObjetos[i]) : listaObjetos[i] ;
          if (objetoParaMesclar.geometry.type == 'LineString') {
            objetoParaMesclar = turf.buffer(objetoParaMesclar, 0.0001, {units: 'meters'});
          }
          objetoMesclado = turf.union(objetoMesclado, objetoParaMesclar);
        }
      }
      return objetoMesclado;
    } else {
      return null;
    }
  }

  separarObjetos(listaObjetos) {
    let objetoCortante = null
    let objetoParaSerCortado = null;
    const listaObjetosCortados = [];

    if (listaObjetos == null || listaObjetos == undefined) {
      return null;
    }

    for (let i = 0 ; i < listaObjetos.length ; i++) {
      if(listaObjetos[i]['objCorte']){
        objetoCortante = this.toGeoJSON(listaObjetos[i]);
        if (objetoCortante.geometry.type == 'LineString') {
          objetoCortante = turf.buffer(objetoCortante, 0.0001, {units: 'meters'});
        }
      }
    }


    if (listaObjetos.length > 1) {
      for (let i = 0 ; i < listaObjetos.length ; i++) {
       
        if(!listaObjetos[i]['objCorte']){
          objetoParaSerCortado = this.toGeoJSON(listaObjetos[i]);
          if (objetoParaSerCortado.geometry.type == 'LineString') {
            objetoParaSerCortado = turf.buffer(objetoParaSerCortado, 0.0001, {units: 'meters'});
          }
          var objetoResuldado = turf.difference(objetoParaSerCortado, objetoCortante);
          objetoResuldado['optionsColorBefore'] = listaObjetos[i]['optionsColorBefore'];   
          listaObjetosCortados.push(objetoResuldado);
        }
      }

      for (let i = 0 ; i < listaObjetos.length ; i++) {
        if(listaObjetos[i]['objCorte']){
          listaObjetos[i]['objCorte'] = false;
        }
      }

      return listaObjetosCortados;
    } else {
      return null;
    }
  }

  gerarPoligono(coordenadas, opcoes, propriedades) {
    if (coordenadas) {
      if (!opcoes) {
        opcoes = {};
      }
      if (!propriedades) {
        propriedades = {};
      }
      while (coordenadas.length < 4) {
        coordenadas.push(coordenadas[0]);
      }
      let poligono = turf.polygon([coordenadas], propriedades, opcoes);
      return poligono;
    } else {
      return null;
    }

  }

  getCentroide(layer) {
    if (layer.geometry) {
      const centroide: any = turf.centroid(layer);
      return centroide.geometry.coordinates;
    } else {
      const geoJson = this.toGeoJSON(layer);
      if (geoJson.geometry.type == 'MultiPolygon') {
        const centroide: any = turf.center(geoJson);
        return centroide.geometry.coordinates;
      }
      const centroide: any = turf.centroid(geoJson);
      return centroide.geometry.coordinates;
    }

  }

  multiPolygon2Polygons(multiPolygon: any){
    const listaPoligonos = [];
    const coordinates = multiPolygon.geometry.coordinates;

    for (const itemCoordenada of coordinates) {
      if(itemCoordenada[0][0].lng){
        for (const coordenadas of itemCoordenada) {
          const listaCoordenada = [];
          for (const coordenada of coordenadas) {
            listaCoordenada.push([coordenada.lng, coordenada.lat]);
          }
          while(listaCoordenada.length < 4){
            listaCoordenada.push(listaCoordenada[0]);
          }
          listaCoordenada.push(listaCoordenada[0]);
          const poligono = this.gerarPoligono(listaCoordenada, {} , multiPolygon.properties);
          listaPoligonos.push(poligono);

        }
      } else if (Array.isArray(itemCoordenada[0][0])){
          for (const coordenadas of itemCoordenada) {
            const listaCoordenada = [];
            for (const coordenada of coordenadas) {
              listaCoordenada.push([coordenada[0], coordenada[1]]);
            }
            while(listaCoordenada.length < 4){
              listaCoordenada.push(listaCoordenada[0]);
            }
            listaCoordenada.push(listaCoordenada[0]);
            const poligono = this.gerarPoligono(listaCoordenada, {} , multiPolygon.properties);
            listaPoligonos.push(poligono);

          }
      } else {
        const listaCoordenada = [];
        for (const coordenadas of itemCoordenada) {
          listaCoordenada.push([coordenadas[0], coordenadas[1]]);
        }
        while(listaCoordenada.length < 4){
          listaCoordenada.push(listaCoordenada[0]);
        }
        listaCoordenada.push(listaCoordenada[0]);
        const poligono = this.gerarPoligono(listaCoordenada, {} , multiPolygon.properties);
        listaPoligonos.push(poligono);
      }
    }
    return listaPoligonos;

  }
}
