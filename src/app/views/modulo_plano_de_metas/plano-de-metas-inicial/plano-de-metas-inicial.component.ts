import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CidadeService } from 'src/app/services/cidade.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-plano-de-metas-inicial',
  templateUrl: './plano-de-metas-inicial.component.html',
  styleUrls: ['./plano-de-metas-inicial.component.css']
})
export class PlanoDeMetasInicialComponent implements OnInit {

  public formFiltro: FormGroup;
  public cidadeComEstado: {} = {};

  constructor(
    private formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    private titleService: Title,) {
    this.formFiltro = this.formBuilder.group({
      cidade: [''],
    });
    this.titleService.setTitle("Plano de Metas - Cidades Sustentáveis")
   }

  ngOnInit() {
    this.buscarPlanoDeMetasPorCidade();
  }

  public buscarPlanoDeMetasPorCidade(){
    this.cidadeService.buscarEstadoECidadesPorNome(this.formFiltro.controls.cidade.value).subscribe(response => {
      this.cidadeComEstado = response;

      if(Object.getOwnPropertyNames(response).length === 0){
        const toast = PcsUtil.swal().mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
        });
        
        toast.fire({
          type: 'error',
          title: 'Não foi encontrado plano de metas com esse nome de cidade.'
        });
      }
    });
  }
}
