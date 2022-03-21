import { Component, OnInit, ElementRef } from '@angular/core';
import { PremiacaoAdminComponent } from '../premiacao-admin/premiacao-admin.component';
import { Premiacao } from 'src/app/model/premiacao';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PremiacaoService } from 'src/app/services/premiacao.service';
import { StatusPremiacao } from 'src/app/model/enums/premiacao-enum';
import { Arquivo } from 'src/app/model/arquivo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-premiacao-admin-form',
  templateUrl: './premiacao-admin-form.component.html',
  styleUrls: ['./premiacao-admin-form.component.css']
})
export class PremiacaoAdminFormComponent implements OnInit {



  public premiacaoSelecionado: Premiacao = new Premiacao();
  public premiacaoAdminComponent: PremiacaoAdminComponent;
  selecionarContinente: any;
  input: any;
  nomeBotao: string;
  premiacaoAdminForm: FormGroup;
  loading = true;
  listaStatusPremiacao = this.enumSelector(StatusPremiacao);
  bannerPremiacao: Arquivo = new Arquivo();
  private idBannerPremiacaoRemover = -1;

  public bannerSelecionado: SafeResourceUrl;
  scrollUp: any;

  ngOnInit() {
    this.loading = true;
    if (location.pathname.includes('editar')) {
      this.buscarPremiacao();
      this.nomeBotao = 'Editar';
    } else if (location.pathname.includes('cadastrar')) {
      this.nomeBotao = 'Cadastrar';
    } else {
      this.router.navigate(['/premiacaoAdmin']);
    }
    this.loading = false;
  }

  async buscarPremiacao() {
    await this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        await this.premiacaoService.buscarPorId(id).subscribe(async response => {
          this.premiacaoAdminForm.controls.inicio.setValue(new Date(response.inicio));
          this.premiacaoAdminForm.controls.fim.setValue(new Date(response.fim));
          this.premiacaoAdminForm.controls.descricao.setValue(response.descricao);
          this.premiacaoAdminForm.controls.status.setValue(response.status);
          this.premiacaoAdminForm.controls.bannerPrincipal.setValue(response.bannerPremiacao);
          this.premiacaoSelecionado = response;

          this.bannerSelecionado = this.domSanitizer.bypassSecurityTrustResourceUrl(
            'data:image/png;base64, ' + this.premiacaoSelecionado.bannerPremiacao.conteudo);

        }, error => { this.loading = false; });
      } else {
        this.loading = false;
      }
    }, error => { this.loading = false; });
  }

  constructor(public premiacaoService: PremiacaoService, public formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              private router: Router, private element: ElementRef, private domSanitizer: DomSanitizer) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
      this.premiacaoAdminForm = this.formBuilder.group({
        inicio: ['', Validators.required],
        fim: ['', Validators.required],
        descricao: ['', Validators.required],
        status: ['', Validators.required],
        bannerPrincipal: ['', Validators.required]
      });
  }

  async salvarPremiacao() {
    this.loading = true;
    this.premiacaoSelecionado.inicio = this.premiacaoAdminForm.controls.inicio.value;
    this.premiacaoSelecionado.fim = this.premiacaoAdminForm.controls.fim.value;
    this.premiacaoSelecionado.descricao = this.premiacaoAdminForm.controls.descricao.value;
    this.premiacaoSelecionado.status = this.premiacaoAdminForm.controls.status.value;



    if (this.premiacaoSelecionado.id) {

      await this.premiacaoService.editarPremiacao(this.premiacaoSelecionado, this.idBannerPremiacaoRemover).subscribe(async response => {
        await PcsUtil.swal().fire({
          title: 'Premiação',
          text: `Premiação ${this.premiacaoSelecionado.descricao} atualizada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/premiacaoAdmin']);
        }, error => { });
      });

      this.idBannerPremiacaoRemover =  -1;
    } else {

      await this.premiacaoService.inserirPremiacao(this.premiacaoSelecionado).subscribe(async response => {
        await PcsUtil.swal().fire({
          title: 'Premiação',
          text: `Premiação ${this.premiacaoSelecionado.descricao} atualizada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/premiacaoAdmin']);
        }, error => { });
      });

    }

    this.loading = false;
  }

  public enumSelector(definition: typeof StatusPremiacao) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  }

  async processFile(event: any) {
      this.loading = true;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.premiacaoSelecionado.bannerPremiacao = new Arquivo();
        this.premiacaoSelecionado.bannerPremiacao.nomeArquivo = event.target.files[0].name;
        this.premiacaoSelecionado.bannerPremiacao.extensao = reader.result.toString().split(',')[0];
        this.premiacaoSelecionado.bannerPremiacao.conteudo = reader.result.toString().split(',')[1];
        if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
          this.premiacaoAdminForm.controls.bannerPrincipal.setValue(this.bannerPremiacao);
          this.bannerSelecionado = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + this.premiacaoSelecionado.bannerPremiacao.conteudo);
        } else {
          PcsUtil.swal().fire({
            title: 'Cadastro de Premiação',
            text: `Arquivo excede o tamanho limite de 10 MB`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });
        }

      };
      this.loading = false;
  }

  public deletarImagemPrincipal(premiacao: Premiacao) {
    this.idBannerPremiacaoRemover = this.premiacaoSelecionado.bannerPremiacao.id;
    this.premiacaoSelecionado.bannerPremiacao = null;
    this.bannerSelecionado = null;
    this.premiacaoAdminForm.controls.bannerPrincipal.setValue(null);
  }

}


