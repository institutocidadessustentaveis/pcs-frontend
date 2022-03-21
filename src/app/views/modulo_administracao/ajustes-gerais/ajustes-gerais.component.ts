import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AjusteGeral } from 'src/app/model/ajuste-geral';
import { AjusteGeralService } from 'src/app/services/ajuste-geral.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-ajustes-gerais',
  templateUrl: './ajustes-gerais.component.html',
  styleUrls: ['./ajustes-gerais.component.css']
})
export class AjustesGeraisComponent implements OnInit {

  public ALERTA_EMAIL = 'ALERTA-EMAIL-NOVA-CIDADE';
  public JANELA_SIG = 'JANELA-ABERTURA-SIG-TEXTO';
  public TELEFONE_ALERTA = 'TELEFONE-ALERTA-BLOQUEIO-CARTA';
  public EMAIL_PLANO_METAS = 'EMAIL-ALERTA-PLANO-METAS';

  public emailAlertaCidade: string;
  public telAlertaCidade: string;
  public emailAlertaPlanoMeta: string;
  public janelaAberturaSigTexto: string;

  public listaEmailsAlerta = [];
  public listaEmailsPlanoMetas = [];

  public displayedColumnsEmails = ['email', 'remover'];
  public dataSourceEmailsAlerta = new MatTableDataSource<any>();
  public dataSourceEmailsPlanoMetas = new MatTableDataSource<any>();

  constructor(private ajusteGeralService: AjusteGeralService) { }

  ngOnInit(){
      
  }

  ngAfterViewInit() {
    this.buscarAjustesExistentes();
  }


  public salvarAjuste(conteudo: string, localApp: string) {
    const ajusteGeral = new AjusteGeral;

    ajusteGeral.conteudo = conteudo;
    ajusteGeral.localAplicacao = localApp;

    this.ajusteGeralService.inserirAjuste(ajusteGeral).subscribe(res => {
      PcsUtil.swal().fire({
        title: 'Cadastro feito com sucesso',
        text: `Ajuste cadastrado com sucesso!`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    });
  }

  public buscarAjustesExistentes() {
    this.buscarEmailsAlerta();
    this.buscarTextoJanelaSig();
    this.buscarTelAlerta();
    this.buscarEmailAlertaPlanoMeta();
  }

  public salvarEmailAlerta(conteudo: string, localApp: string) {
    const ajusteGeral = new AjusteGeral;

    ajusteGeral.conteudo = conteudo;
    ajusteGeral.localAplicacao = localApp;

    this.ajusteGeralService.inserirAjuste(ajusteGeral).subscribe(res => {
      if(res) {
        PcsUtil.swal().fire({
          title: 'Cadastro feito com sucesso',
          text: `Ajuste cadastrado com sucesso.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
        this.buscarEmailsAlerta();
      }
     
    });

  }

  public salvarEmailPlanoMetas(conteudo: string, localApp: string) {
    const ajusteGeral = new AjusteGeral;

    ajusteGeral.conteudo = conteudo;
    ajusteGeral.localAplicacao = localApp;

    this.ajusteGeralService.inserirAjuste(ajusteGeral).subscribe(res => {
      if(res) {
        PcsUtil.swal().fire({
          title: 'Cadastro feito com sucesso',
          text: `Ajuste cadastrado com sucesso.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
        this.buscarEmailAlertaPlanoMeta();
      }
     
    });

  }

  remover(ajusteGeral) {
    const ajuste = ajusteGeral;
    this.ajusteGeralService.deletar(ajuste.id).subscribe(res => {
      PcsUtil.swal().fire({
        title: 'Sucesso',
        text: `Ajuste deletado com sucesso.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
      this.buscarEmailsAlerta();
      this.buscarEmailAlertaPlanoMeta();
    })
  }

  public buscarEmailsAlerta() {
    this.ajusteGeralService.buscarListaAjustes(this.ALERTA_EMAIL).subscribe(res => {
      if(res){
        //this.emailAlertaCidade = res.conteudo;
        this.listaEmailsAlerta = res;
        this.dataSourceEmailsAlerta = new MatTableDataSource<AjusteGeral>(this.listaEmailsAlerta);
      }
    });
  }

  public buscarTextoJanelaSig() {
    this.ajusteGeralService.buscarAjustePorLocalApp(this.JANELA_SIG).subscribe(res => {
      if(res){
        this.janelaAberturaSigTexto = res.conteudo;
      }
     
    })
  }

  public buscarTelAlerta() {
    this.ajusteGeralService.buscarAjustePorLocalApp(this.TELEFONE_ALERTA).subscribe(res => {
      if(res){
        this.telAlertaCidade = res.conteudo;
      }
     
    })
  }

  public buscarEmailAlertaPlanoMeta() {
    this.ajusteGeralService.buscarListaAjustes(this.EMAIL_PLANO_METAS).subscribe(res => { 
      if(res) {
        this.listaEmailsPlanoMetas = res;
        this.dataSourceEmailsPlanoMetas = new MatTableDataSource<AjusteGeral>(this.listaEmailsPlanoMetas);
      }
    });
  }

  public editorConfig: any = {
    height: '300px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link','hr']],
      ['view', ['fullscreen', 'codeview']],
      ['customButtons', ['Blockquote', 'H1', 'H2', 'H3']]
    ],
    fontNames: [
      'Arial',
      'Arial Black',
      'AT Surt',
      'AT Surt Bold',
      'AT Surt Light',
      'Calibri',
      'Comic Sans MS',
      'Courier New',
      'Futura Book', 
      'Futura Light', 
      'Georgia',
      'Glacial Indiff',
      'Helvetica',
      'Helvetica Neue',
      'Noto Sans',
      'Open Sans',
      'Roboto',
      'Source Sans Pro',
      'Tahoma',
      'Times',
      'trebuchet ms',
      'Verdana'
    ],
  };

}
