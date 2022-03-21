import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { DBChangelogService } from 'src/app/services/dbchangelog.service';
import { DBChangelog } from 'src/app/model/dbchangelog';
import { BuildVersionService } from 'src/app/services/buildversion.service';
import { BuildVersion } from 'src/app/model/buildversion';
import { FormControl, Validators } from '@angular/forms';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { LinkRodapeService } from 'src/app/services/link-rodape.service';
import { ContatoPcsService } from 'src/app/services/contato-pcs.service';
import { RedeSocialRodapeService } from 'src/app/services/rede-social-rodape.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css','./footer.component.scss']
})
export class FooterComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  emailNewsletter: string = "";

  success: boolean = false;

  urlatual: string;

  apiUrl = environment.API_URL;

  ambiente = environment.NOME;

  producao = environment.production;

  dbchangelog: DBChangelog  = new DBChangelog();

  buildVersionBackend: BuildVersion = new BuildVersion();

  buildVersionFrontend: BuildVersion = new BuildVersion();

  links: any[] = []

  contato: any = {};

  redesSociais: any[] = [];

  constructor(private dbChangeService: DBChangelogService,
              private buildService: BuildVersionService, 
              private newsletterService: NewsletterService,
              private linkRodapeService: LinkRodapeService,
              private contatoPcsService: ContatoPcsService,
              private redeSocialRodapeService: RedeSocialRodapeService) { }


  ngOnInit() {
    this.urlatual = window.location.href;
    this.buscarBDAtual();
    this.buscarBuildBackendAtual();
    this.buscarBuildFrontendAtual();
    this.buscarLinksPcs();
    this.buscarContatoPcs();
    this.buscarRedesSociais();

    this.linkRodapeService.linksChanged.subscribe((links) => {
      this.links = links;
    });

    this.contatoPcsService.contatoChanged.subscribe((contato) => {
      this.contato = contato;
    });

    this.redeSocialRodapeService.redeSocialChanged.subscribe((redesSociais) => {
      this.redesSociais = redesSociais;
    });
  }

  buscarBDAtual() {
    this.dbChangeService.buscarVersaoAtual().subscribe(response => {
      this.dbchangelog = response as DBChangelog;
    });
  }

  buscarBuildBackendAtual() {
    this.buildService.buscarBuildBackendAtual().subscribe(response => {
      this.buildVersionBackend = response as BuildVersion;
    });
  }

  buscarBuildFrontendAtual() {
    this.buildService.buscarBuildFrontendAtual().subscribe(response => {
      this.buildVersionFrontend = response as BuildVersion;
    });
  }

  buscarLinksPcs() {
    this.linkRodapeService.buscarLinksOrdenadosComCache().subscribe((links) => {
      this.links = links as any[];
    });
  }

  buscarContatoPcs() {
    this.contatoPcsService.buscarContatoMaisRecenteComCache().subscribe((contato) => {
      this.contato = contato;
    });
  }

  buscarRedesSociais() {
    this.redeSocialRodapeService.buscarRedesSociaisComCache().subscribe((redesSociais) => {
      this.redesSociais = redesSociais as any[];
    })
  }

  public assinarNewsletter() {
    if(this.emailFormControl.valid) {
      this.newsletterService.assinarNewsletter(this.emailNewsletter).subscribe(() => {
        this.emailNewsletter = "";
        this.emailFormControl.clearValidators();
        this.success = true;
      });
    }
  }
}
