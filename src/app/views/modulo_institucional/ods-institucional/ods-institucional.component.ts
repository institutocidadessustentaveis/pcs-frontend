import { MetaObjetivoDesenvolvimentoSustentavel } from 'src/app/model/metaObjetivoDesenvolvimentoSustentavel';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from 'src/app/services/seo-service.service';
import { HttpClient } from '@angular/common/http';

export class EmailFormStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "app-ods-institucional",
  templateUrl: "./ods-institucional.component.html",
  styleUrls: ["./ods-institucional.component.css"]
})
export class OdsInstitucionalComponent implements OnInit {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  emailNewsletter: string = "";

  success: boolean = false;

  public displayedColumns: string[] = ["meta"];

  public dataSource: MatTableDataSource<MetaObjetivoDesenvolvimentoSustentavel>;

  public listaOds: ObjetivoDesenvolvimentoSustentavel[] = [];

  public odsSelecionado: ObjetivoDesenvolvimentoSustentavel = null;

  matcher = new EmailFormStateMatcher();
  scrollUp: any;
  idOds: number;

  constructor(
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private newsletterService: NewsletterService,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private seoService: SeoService, private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.idOds = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idOds) {
      this.carregarDados(this.idOds);
    } else{
      this.carregarDados(1);
    }
  }

  private carregarDados(idOds: number) {
    this.odsService.buscarOdsParaPaginaInstitucional().subscribe(response => {
      this.listaOds = response as ObjetivoDesenvolvimentoSustentavel[];
      for (let item of this.listaOds) {
        item.iconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.icone
        );
        item.iconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.iconeReduzido
        );
      }
      if (idOds == null){
        this.selecionarOds(this.listaOds[0]);
      } else {
        this.listaOds.forEach(ods => {
          if (ods.id === idOds) {
            this.selecionarOds(ods);
          }
        });
      }

    });
  }

  public selecionarOds(odsSelecionado: ObjetivoDesenvolvimentoSustentavel) {
    this.dataSource = new MatTableDataSource<MetaObjetivoDesenvolvimentoSustentavel>(odsSelecionado.metas);
    this.odsSelecionado = odsSelecionado;
  }

  public assinarNewsletter() {
    if (this.emailFormControl.valid) {
      this.newsletterService
        .assinarNewsletter(this.emailNewsletter)
        .subscribe(() => {
          this.emailNewsletter = "";
          this.emailFormControl.clearValidators();
          this.success = true;
        });
    }
  }

  public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
    return `${environment.API_URL}ods/imagem/${ods.id}`;
  }
}
