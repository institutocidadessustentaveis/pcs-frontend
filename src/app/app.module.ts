import { GoogleAnalyticsService } from './services/google-analytics.service';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { HAMMER_LOADER } from "@angular/platform-browser";
import { GridExampleComponent } from './template/grid-example/grid-example.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { TemplateModule } from './template/template.module';
import { SeoModule } from './views/modulo_administracao/seo/seo.module';
import { ContribuicoesPrivadasPrincipalComponent } from './views/modulo_contribuicoes_privadas/contribuicoes-privadas-principal/contribuicoes-privadas-principal.component';
import { MatAutocompleteModule, MatButtonModule, MatDialogModule, MatInputModule, MatRadioModule } from '@angular/material';



registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    GridExampleComponent,
    AppComponent
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    TemplateModule,
    SeoModule,
    MatDialogModule
  ],
  //entryComponents: [DialogCadastroMetas, DialogTermos, DialogEsqueciSenha, DialogModalPlanoMeta, JustificativaReprovacaoDialog, ModalErroComponent, DialogModalReenvioEmail],
  providers: [
    GoogleAnalyticsService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: HAMMER_LOADER, useValue: () => new Promise(() => {})},
    BnNgIdleService,
],

  bootstrap: [AppComponent],
})
export class AppModule { }
