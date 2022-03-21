import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PaisService } from 'src/app/services/pais.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { PrefeituraEdicao } from 'src/app/model/prefeitura-edicao';
import { PartidoPoliticoService } from 'src/app/services/partido-politico.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-prefeitura-admin-form',
  templateUrl: './prefeitura-admin-form.component.html',
  styleUrls: ['./prefeitura-admin-form.component.css']
})
export class PrefeituraAdminFormComponent implements OnInit {

  loading: boolean = false;

  idPrefeitura: number;

  prefeituraAdminForm: FormGroup;

  listaPaises: Array<any>;

  listaEstado: Array<any>;

  listaCidades: Array<any>;

  listaPartidos: any[];

  paisSelecionado: number;

  estadoSelecionado: number;

  cidadeSelecionada: number;

  partidoSelecionado: number;

  mascara: string;

  visualizacao = false;

  scrollUp: any;

  constructor(private prefeituraService: PrefeituraService,
              private paisService: PaisService,
              private provinciaEstadoService: ProvinciaEstadoService,
              private cidadesService: CidadeService,
              private partidoService: PartidoPoliticoService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private element: ElementRef) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    this.prefeituraAdminForm = this.formBuilder.group({
      nomePrefeito: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ["", Validators.required],
      inicioMandato: ['', Validators.required],
      fimMandato: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.buscarPrefeitura();
    this.buscarPaises();
    this.buscarPartidos();
    this.defineMascaraTelefone();
  }

  buscarPrefeitura() {
    this.activatedRoute.params.subscribe(params => {
      this.loading = true;
      this.idPrefeitura = params.id;

      if(this.idPrefeitura) {
        this.prefeituraService.buscarPrefeituraEdicao(this.idPrefeitura).subscribe(response => {
          this.prefeituraAdminForm.controls.nomePrefeito.setValue(response.nomePrefeito);
          this.prefeituraAdminForm.controls.email.setValue(response.email);
          this.prefeituraAdminForm.controls.telefone.setValue(response.telefone);
          this.prefeituraAdminForm.controls.inicioMandato.setValue(new Date(response.inicioMandato));
          this.prefeituraAdminForm.controls.fimMandato.setValue(new Date(response.fimMandato));
          this.paisSelecionado = response.idPais;

          this.buscarEstados(this.paisSelecionado);

          this.estadoSelecionado = response.idEstado;

          this.buscarCidades(this.estadoSelecionado);

          this.cidadeSelecionada = response.idCidade;

          this.partidoSelecionado = response.idPartido;

          this.loading = false;
        })
      }
    });
  }

  salvarPrefeitura() {
    let prefeitura: PrefeituraEdicao = new PrefeituraEdicao();

    prefeitura.id = this.idPrefeitura;
    prefeitura.nomePrefeito = this.prefeituraAdminForm.controls.nomePrefeito.value;
    prefeitura.email = this.prefeituraAdminForm.controls.email.value;
    prefeitura.telefone = this.prefeituraAdminForm.controls.telefone.value;
    prefeitura.inicioMandato = this.prefeituraAdminForm.controls.inicioMandato.value;
    prefeitura.fimMandato = this.prefeituraAdminForm.controls.fimMandato.value;
    prefeitura.idPais = this.paisSelecionado;
    prefeitura.idEstado = this.estadoSelecionado;
    prefeitura.idCidade = this.cidadeSelecionada;
    prefeitura.idPartido = this.partidoSelecionado;

    this.prefeituraService.editar(prefeitura).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Prefeitura atualizada',
        text: ``,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/prefeitura'])
      }, error => { });
    });
  }

  buscarPaises() {
    this.paisService.buscarTodos().subscribe(response => {
      this.listaPaises = response;
    });
  }

  buscarEstados(idPais: number) {
    this.provinciaEstadoService.buscarPorPais(idPais).subscribe(response => {
      this.listaEstado = response;
    });
  }

  buscarCidades(idEstado: any) {
    let id = idEstado.value ? idEstado.value : idEstado ;
    this.cidadesService.buscarCidadeParaComboPorIdEstado(id).subscribe(response => {
      this.listaCidades = response;
    });
  }

  buscarPartidos() {
    this.partidoService.buscar().subscribe(response => {
      this.listaPartidos = response;
    });
  }

  defineMascaraTelefone() {
    if(this.prefeituraAdminForm.controls.telefone.value.replace("/[^0-9]/g", "").length > 10) {
      this.mascara = "(00) 0 0000-0000";
    } else {
      this.mascara = "(00) 0000-0000";
    }
  }

  getErrorTelefone() {
    return this.prefeituraAdminForm.get("telefone").hasError("required") ? "Telefone é obrigatório" : "";
  }

}
