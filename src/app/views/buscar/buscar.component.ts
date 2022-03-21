import { Buscar } from './../../model/buscar';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Noticia } from 'src/app/model/noticia';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscarService } from 'src/app/services/buscar.service';

@Component({
  selector: 'app-busca-inicial',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;

  buscar: Buscar;

  noticiasSelecionadas: Noticia[];

  loading = false;

  scrollUp: any;

  palavraChave = '';

  constructor(private buscarService: BuscarService,
              private formBuilder: FormBuilder,
              private element: ElementRef,
              private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    this.form = this.formBuilder.group(({
      palavrasChave: ['', Validators.required]
    }));
  }

  ngOnInit() {

  }

  public buscarPorPalavraChave() {
    this.palavraChave = Object.freeze(`${this.form.controls.palavrasChave.value}`);

    this.loading = true;
    this.buscarService.buscarPorPalavraChave(this.form.controls.palavrasChave.value).subscribe((response) => {
      this.buscar = response as Buscar;
      this.loading = false;
    });
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url) {
      return `/noticia/${noticia.url}?palavra-chave=${this.palavraChave}`;
    } else {
      return `/noticia/${noticia.id}?palavra-chave=${this.palavraChave}`;
    }
  }

  public gerarLinkBoaPratica(boaPratica: any) {
    if (boaPratica.url) {
      return `/boas-praticas/${boaPratica.url}?palavra-chave=${this.palavraChave}`;
    } else {
      return `/boas-praticas/${boaPratica.id}?palavra-chave=${this.palavraChave}`;
    }
  }

  public gerarLinkMaterialInstitucional(materialInstitucional: any) {
    if (materialInstitucional.url) {
      return '/institucional/pagina/' + materialInstitucional.url;
    } else {
      return '/institucional/pagina/' + materialInstitucional.id;
    }
  }

  public gerarLinkIndicador(indicador: any) {
    if (indicador.url) {
      return '/visualizarindicador/' + indicador.url;
    } else {
      return '/visualizarindicador/' + indicador.id;
    }
  }

}
