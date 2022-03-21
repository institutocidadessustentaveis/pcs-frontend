import { ElementRef, HostListener, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PcsUtil } from './../../../services/pcs-util.service';
import { FaqService } from 'src/app/services/faq.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatFormField } from '@angular/material';
import { faq } from 'src/app/model/faq';
import { ActivatedRoute } from '@angular/router';
import { Numbering } from 'docx';
import { FiltroFaq } from 'src/app/model/filtroFaq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  loading = false;
  faq: faq[];
  public idsFaqs: Array<any> = [];
  dropList: Number[] = [];
  public filtroFaq: FiltroFaq = new FiltroFaq();
  public formFiltro: FormGroup;
  public isExpanded = false;
  exibirMensagemAlerta: boolean = false;

  public palavraPesquisada;

  constructor(
    private faqService: FaqService,
    private titleService: Title,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.formFiltro = this.formBuilder.group({
      palavraChave: [null]
    });
    this.route.queryParams.subscribe(params => {
      this.formFiltro.controls.palavraChave.setValue(params['palavraChave']);
      this.palavraPesquisada = params['palavraChave'];
  });
  }

  ngOnInit() {
    this.buscarFaq();
    this.titleService.setTitle("FAQ - Cidades Sustentáveis")
  }

  adicionarDrop(id: number) {

    if (this.dropList.includes(id)) {
      this.dropList.splice(this.dropList.indexOf(id), 1)
    } else {
      this.dropList.push(id);
    }
  }


  public construirParamsURL() {
    this.filtroFaq.palavraChave = this.formFiltro.controls.palavraChave.value;

    let new_URL =
    this.filtroFaq.palavraChave ?
      `/faq?palavraChave=${this.filtroFaq.palavraChave}` : '/faq?';

    window.history.replaceState( {} , '', new_URL );
  }

  public buscarFaq() {
    this.loading = true;
    this.construirParamsURL();
    this.filtroFaq.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.palavraPesquisada = this.formFiltro.controls.palavraChave.value;

    if (this.filtroFaq.palavraChave === undefined) {
      this.filtroFaq.palavraChave = '';
    }

    this.faqService.buscarFaqFiltrado(this.filtroFaq.palavraChave)
    .subscribe(res => {
      this.idsFaqs = res;
      if(this.filtroFaq.palavraChave != ''){
        this.isExpanded = true;
      }else{
        this.isExpanded = false;
      }
      let el = document.getElementById('faqList');
      el.scrollIntoView();
      this.exibirMensagemAlerta = res.length == 0;
      this.loading = false;
    });
  }

  public limparFiltro() {
    this.formFiltro.controls.palavraChave.setValue('');
    this.buscarFaq();
  }

}
