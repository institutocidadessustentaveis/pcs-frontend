import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { LinkRodapeService } from 'src/app/services/link-rodape.service';
import { Router } from '@angular/router';
import { ContatoPcsService } from 'src/app/services/contato-pcs.service';
import { RedeSocialRodapeService } from 'src/app/services/rede-social-rodape.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent implements OnInit {

  linksPcs: any[] = [];

  contato: any = {};

  redeSocial: any = {};

  redesSociaisLinks: any[] = [];

  formLinksRodape: FormGroup;

  formContatoRodape: FormGroup;

  formRedesSociaisRodape: FormGroup;

  displayedColumnsLinks: string[] = ["Título", "URL", "Ações"];

  displayedColumnsRedesSociais: string[] = ["Rede social", "Link do perfil",  "Ações"];

  dataSourceLinks = new MatTableDataSource<any>();

  dataSourceRedesSociais = new MatTableDataSource<any>();

  redeSocialSelecionada: string = 'FACEBOOK';

  loading: boolean = false;

  scrollUp: any;

  constructor(public formBuilder: FormBuilder, 
              public linkRodapeService: LinkRodapeService,
              public contatoPcsService: ContatoPcsService,
              public redeSocialRodapeService: RedeSocialRodapeService,
              private router: Router,
              private element: ElementRef,
              private titleService: Title) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formLinksRodape = this.formBuilder.group({
      tituloLink: ['', Validators.required],
      urlLink: ['', Validators.required],
      abrirNovaJanela: ['']
    });

    this.formContatoRodape = this.formBuilder.group({
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      link: ['']
    });

    this.formRedesSociaisRodape = this.formBuilder.group({
      redeSocial: [''],
      url: ['', Validators.required]
    });
    this.titleService.setTitle("Rodapé - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.buscarLinksOrdenados();
    this.buscarContatoPcs();
    this.buscarRedesSociaisPcs();
  }

  public adicionarLinkPcs(formDirective: FormGroupDirective) {
    if(this.formLinksRodape.invalid) {
      return;
    }

    this.loading = true;

    let titulo = this.formLinksRodape.controls.tituloLink.value;
    let url = this.formLinksRodape.controls.urlLink.value;
    let abrirNovaJanela = this.formLinksRodape.controls.abrirNovaJanela.value == "" ? false : true;

    if(!titulo && !url) {
      this.exibirMensagemErro("Título e URL não podem ser nulos", "");
      this.loading = false;
      return;
    }

    if(this.linksPcs.length >= 4) {
      this.exibirMensagemErro("Não é possível adicionar mais de quatro links no rodapé", 
                              "Tente excluir um link antes de adicionar um novo");
      this.loading = false;
      return;
    }

    this.linksPcs.push({'titulo': titulo, 'url': url, 'abrirNovaJanela': abrirNovaJanela});
    this.dataSourceLinks.data = this.linksPcs;

    this.linkRodapeService.save(this.linksPcs).subscribe(() => {
      this.limparFormLinks();
      this.buscarLinksOrdenados();
      this.linkRodapeService.linksChanged.emit(this.linksPcs);
      formDirective.resetForm();
      this.formLinksRodape.reset();
      this.loading = false;
    });
  }

  public salvarContatoPcs(formDirective: FormGroupDirective) {
    this.loading = true;

    if(this.formContatoRodape.invalid) {
      this.loading = false;
      return;
    }

    this.contato.endereco = this.formContatoRodape.controls.endereco.value;
    this.contato.cidade = this.formContatoRodape.controls.cidade.value;
    this.contato.telefone = this.formContatoRodape.controls.telefone.value;
    this.contato.cep = this.formContatoRodape.controls.cep.value;
    this.contato.link = this.formContatoRodape.controls.link.value;

    this.contatoPcsService.salvarContatoPcs(this.contato).subscribe(() => {
      this.contatoPcsService.contatoChanged.emit(this.contato);
      this.loading = false;
    });
  }

  public salvarRedesSociaisPcs(formDirective: FormGroupDirective) {
    this.loading = true;

    if(this.formRedesSociaisRodape.invalid) {
      this.loading = false;
      return;
    }

    if(this.redesSociaisLinks.length >= 6) {
      this.exibirMensagemErro("Não é possível adicionar mais de seis redes sociais no rodapé", 
                              "Tente excluir uma rede social antes de adicionar uma nova");
      this.loading = false;
      return;
    }

    this.redeSocial.tipo = this.redeSocialSelecionada;
    this.redeSocial.urlPerfil = this.formRedesSociaisRodape.controls.url.value;

    this.redesSociaisLinks.push(this.redeSocial);

    this.redeSocialRodapeService.salvarRedesSociais(this.redesSociaisLinks).subscribe(() => {
      this.limparFormRedeSocial();
      this.buscarRedesSociaisPcs();
      formDirective.resetForm();
      this.formRedesSociaisRodape.reset();
      this.redeSocialRodapeService.redeSocialChanged.emit(this.redesSociaisLinks);
      this.loading = false;
    });

  }

  public moverLinkPcsCima(link) {
    this.loading = true;
    let index = this.linksPcs.indexOf(link);

    if(index == 0) {
      this.loading = false;
      return;
    }

    let previousIndex = index - 1;

    let linkTemp = link;

    this.linksPcs[index] = this.linksPcs[previousIndex];
    this.linksPcs[previousIndex] = linkTemp;

    this.linkRodapeService.save(this.linksPcs).subscribe(() => {
      this.linkRodapeService.linksChanged.emit(this.linksPcs);
      this.dataSourceLinks.data = this.linksPcs;
      this.loading = false;
    });
  }

  public moverLinkPcsBaixo(link) {
    this.loading = true;
    let index = this.linksPcs.indexOf(link);

    if(index == (this.linksPcs.length - 1)) {
      this.loading = false;
      return;
    }

    let nextIndex = index + 1;

    let linkTemp = link;

    this.linksPcs[index] = this.linksPcs[nextIndex];
    this.linksPcs[nextIndex] = linkTemp;

    this.linkRodapeService.save(this.linksPcs).subscribe(() => {
      this.linkRodapeService.linksChanged.emit(this.linksPcs);
      this.dataSourceLinks.data = this.linksPcs;
      this.loading = false;
    });
  }

  public moverRedeSocialPcsCima(redeSocial) {
    this.loading = true;

    let index = this.redesSociaisLinks.indexOf(redeSocial);

    if(index == 0) {
      this.loading = false;
      return;
    }

    let previousIndex = index - 1;

    let redeSocialTemp = redeSocial;

    this.redesSociaisLinks[index] = this.redesSociaisLinks[previousIndex];
    this.redesSociaisLinks[previousIndex] = redeSocialTemp;

    this.redeSocialRodapeService.salvarRedesSociais(this.redesSociaisLinks).subscribe(() => {
      this.dataSourceRedesSociais.data = this.redesSociaisLinks;
      this.redeSocialRodapeService.redeSocialChanged.emit(this.redesSociaisLinks);
      this.loading = false;
    });
  }

  public moverRedeSocialPcsBaixo(redeSocial) {
    this.loading = true;
    let index = this.redesSociaisLinks.indexOf(redeSocial);

    if(index == (this.redesSociaisLinks.length - 1)) {
      this.loading = false;
      return;
    }

    let nextIndex = index + 1;

    let redeSocialTemp = redeSocial;

    this.redesSociaisLinks[index] = this.redesSociaisLinks[nextIndex];
    this.redesSociaisLinks[nextIndex] = redeSocialTemp;

    this.redeSocialRodapeService.salvarRedesSociais(this.redesSociaisLinks).subscribe(() => {
      this.dataSourceRedesSociais.data = this.redesSociaisLinks;
      this.redeSocialRodapeService.redeSocialChanged.emit(this.redesSociaisLinks);
      this.loading = false;
    });
  }

  public removerRedeSocialPcs(redeSocial) {
    PcsUtil.swal()
            .fire({
              title: 'Tem certeza que deseja apagar a rede social?',
              type: "warning",
              showCancelButton: true,
              cancelButtonText: "Não, cancelar",
              confirmButtonText: "Sim, apagar"
            }).then((result) => {
              if(result.value) {
                this.loading = true;

                this.redeSocialRodapeService.excluirRedeSocial(redeSocial.id).subscribe(() => {
                  this.buscarRedesSociaisPcs();
                  this.loading = false;
                });
              }
            });
  }

  public removerLinkPcs(link) {
    PcsUtil.swal()
            .fire({
              title: 'Tem certeza que deseja apagar o link?',
              type: "warning",
              showCancelButton: true,
              cancelButtonText: "Não, cancelar",
              confirmButtonText: "Sim, apagar"
            }).then((result) => {
              if(result.value) {
                this.loading = true;

                this.linkRodapeService.delete(link.id).subscribe(() => {
                  this.buscarLinksOrdenados();
                  this.loading = false;
                });
              }
            });
  }

  public buscarLinksOrdenados() {
    this.loading = true;

    this.linkRodapeService.buscarLinksOrdenados().subscribe((links) => {
      this.linksPcs = links as any[];
      this.linkRodapeService.linksChanged.emit(this.linksPcs);
      this.dataSourceLinks.data = this.linksPcs;
      this.loading = false;
    });
  }

  public buscarContatoPcs() {
    this.loading = true;

    this.contatoPcsService.buscarContatoMaisRecente().subscribe((contato) => {
      this.contato = contato;

      this.formContatoRodape.controls.endereco.setValue(this.contato.endereco);
      this.formContatoRodape.controls.cidade.setValue(this.contato.cidade);
      this.formContatoRodape.controls.telefone.setValue(this.contato.telefone);
      this.formContatoRodape.controls.cep.setValue(this.contato.cep);
      this.formContatoRodape.controls.link.setValue(this.contato.link);
    });
  }

  public buscarRedesSociaisPcs() {
    this.redeSocialRodapeService.buscarRedesSociais().subscribe((redesSociais) => {
      this.redesSociaisLinks = redesSociais as any[];
      this.dataSourceRedesSociais.data = this.redesSociaisLinks;
      this.redeSocialRodapeService.redeSocialChanged.emit(this.redesSociaisLinks);
    });
  }

  public limparFormLinks() {
    this.formLinksRodape.controls.tituloLink.setValue('');
    this.formLinksRodape.controls.urlLink.setValue('');
    this.formLinksRodape.controls.abrirNovaJanela.setValue('');
  }

  public limparFormRedeSocial() {
    this.redeSocialSelecionada = 'FACEBOOK';
    this.formRedesSociaisRodape.controls.url.setValue('');
  }

  public exibirMensagemErro(titulo, subtitulo) {
    PcsUtil.swal()
            .fire({
              title: titulo,
              text: subtitulo,
              type: "warning",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(
              result => { },
            );
  }

  public capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

}
