// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  NOME: 'DESENVOLVIMENTO',
  API_URL: 'http://localhost:8080/',
  APP_URL: 'http://localhost:4200/',
  APP_IMAGEM: '',
  MAP_TILE_SERVER: '',
  MAP_ATTRIBUTION: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
  MAP_TILE_SERVER_SAT: 'http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  MAP_TILE_BLANK: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
