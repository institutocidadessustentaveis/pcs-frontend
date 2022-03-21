import { Pais } from '../../../model/pais';
import { PaisService } from 'src/app/services/pais.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { ProvinciaEstadoComponent } from '../provincia-estado/provincia-estado.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: "app-provincia-estado-form",
  templateUrl: "./provincia-estado-form.component.html",
  styleUrls: ["./provincia-estado-form.component.css"]
})
export class ProvinciaEstadoFormComponent implements OnInit {
  public provinciaEstado: ProvinciaEstado = new ProvinciaEstado();
  public provinciaEstadoComponent: ProvinciaEstadoComponent;
  selecionarProvinciaEstado: any;
  estadosProvincias: any[] = [];
  input: any;
  nomeBotao = "Cadastrar";
  registerForm: FormGroup;
  provinciaEstadoJaCadastrado: Boolean = false;
  listaPaises: any = [];
  paises: Pais[];
  provinciasEstados = [];
  nomePais;
  loading = true;
  scrollUp: any;

  filteredOptions: Observable<string[]>;
  options: string[] = [];

  constructor(
    public provinciaEstadoService: ProvinciaEstadoService,
    public formBuilder: FormBuilder,
    public paisService: PaisService,
    public activatedRoute: ActivatedRoute,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.registerForm = this.formBuilder.group({
      pais: ["", Validators.required],
      estadosProvincias: ["", Validators.required],
      sigla: [""],
      populacao: [],
      estados: [""]
    });
  }

  ngOnInit() {
    this.carregarComboBox();
    this.carregaProvinciaEstado();
    this.carregaLista();
    this.jsonPaisesEstados();
    if (location.pathname.includes("editar")) {
      this.dadosProvinciaEstadoEditar();
    }


  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  private carregaProvinciaEstado(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.provinciaEstadoService
          .buscarProvinciaEstado(id)
          .subscribe(response => {
            this.provinciaEstado = response;
            this.registerForm.controls["estadosProvincias"].setValue(
              response.nome
            );
            this.registerForm.controls["sigla"].setValue(response.sigla);
            this.registerForm.controls["populacao"].setValue(
              response.populacao
            );
            this.registerForm.controls["estados"].setValue(response.nome);
          });
      }
    });
  }

  jsonPaisesEstados() {
    this.provinciaEstadoService.getJSON().subscribe(dados => {
      this.listaPaises = dados.countries;
    });
  }

  onChange() {
    for (const item in this.listaPaises) {
      let paisSelecionado = this.registerForm.controls.pais.value;
      if (this.listaPaises[item].name === paisSelecionado.nome) {
        this.estadosProvincias = this.listaPaises[item].states;
        if(this.estadosProvincias){
          this.options = this.estadosProvincias.map(function(a) {return a.name;});
          this.filteredOptions = this.registerForm.get('estadosProvincias')!.valueChanges.pipe(startWith(''),map(value => this._filter(value)));
        }
      }
    }
  }

  escolhaProvinciaEstado(provinciaEstado) {
    let dadosCadastrados = JSON.parse(localStorage.getItem("dadosCadastrados"));
    let verifica = dadosCadastrados.filter(
      x =>
        PcsUtil.removerAcento(x.nome.toLowerCase().trim()) ===
        PcsUtil.removerAcento(provinciaEstado.toLowerCase().trim())
    );
    if (verifica.length > 0) {
      this.provinciaEstadoJaCadastrado = true;
    } else {
      this.provinciaEstadoJaCadastrado = false;
    }
  }

  async carregarComboBox() {
    await this.paisService.buscarTodos().subscribe(dados => {
      this.paises = dados;
      this.loading = false;
    });
  }

  async carregaLista() {
    this.nomePais = localStorage.getItem("editar-obj-nomePais");
    this.registerForm.controls["pais"].setValue(this.nomePais);
    await this.onChange();
  }

  async dadosProvinciaEstadoEditar() {
    this.nomeBotao = "Editar";
    this.nomePais = localStorage.getItem("editar-obj-nomePais");
    let obj = JSON.parse(localStorage.getItem("editar-obj"));
    this.registerForm.controls["pais"].setValue(this.nomePais);
    await this.onChange();
    this.registerForm.controls["estadosProvincias"].setValue(obj.nome);
    this.registerForm.controls["populacao"].setValue(obj.populacao);
    this.registerForm.controls["estados"].setValue(obj.nome);
  }

  async editarProvinciaEstado() {
    this.registerForm.controls.pais.setValue(
      JSON.parse(localStorage.getItem("editar-obj")).pais
    );
    this.provinciaEstado.id = JSON.parse(localStorage.getItem("editar-obj")).id;
    this.provinciaEstado.pais = this.registerForm.controls["pais"].value;
    this.provinciaEstado.nome = this.registerForm.controls[
      "estadosProvincias"
    ].value;
    this.provinciaEstado.sigla = this.registerForm.controls["sigla"].value;
    this.provinciaEstado.populacao = this.registerForm.controls[
      "populacao"
    ].value;
    await this.provinciaEstadoService
      .editarProvinciaEstado(this.provinciaEstado)
      .subscribe(async response => {
        await PcsUtil.swal()
          .fire({
            title: "Província/Estados",
            text: `Província/Estado ${this.provinciaEstado.nome} atualizada.`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(result => {}, error => {});
      });
  }

  async cadastrarProvinciaEstado() {
    this.provinciaEstado.pais = this.registerForm.controls["pais"].value;
    this.provinciaEstado.nome = this.registerForm.controls[
      "estadosProvincias"
    ].value;
    this.provinciaEstado.sigla = this.registerForm.controls["sigla"].value;
    this.provinciaEstado.populacao = this.registerForm.controls[
      "populacao"
    ].value;
    await this.provinciaEstadoService
      .cadastrarProvinciaEstado(this.provinciaEstado)
      .subscribe(async response => {
        await PcsUtil.swal()
          .fire({
            title: "Província/Estados",
            text: `Província/Estado ${this.provinciaEstado.nome} cadastrada`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(result => {}, error => {});
      });
  }
}
