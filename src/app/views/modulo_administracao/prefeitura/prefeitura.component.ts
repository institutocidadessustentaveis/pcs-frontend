import { Component, OnInit, ElementRef } from '@angular/core';
import { DownloadslogService } from 'src/app/services/downloadslog.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';

const APP_URL = environment.APP_URL;
const path = `${APP_URL}/arquivos/link/carta-compromisso-pcs-estrategia-ods.docx`;

@Component({
  selector: "app-prefeitura",
  templateUrl: "./prefeitura.component.html",
  styleUrls: ["./prefeitura.component.css"]
})
export class PrefeituraComponent implements OnInit {
  scrollUp: any;
  constructor(
    private downloadsLogService: DownloadslogService,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle("Carta-Compromisso - Cidades Sustentáveis")
  }

  ngOnInit() {}

  fileDownloadCarta() {
    window.open(path);
    this.downloadsLogService
      .registrarLogDownload("Carta de Compromisso.docx")
      .subscribe(() => {});
  }
}
