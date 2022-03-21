import { Title } from '@angular/platform-browser';
import { ConfiguracaoComentarioService } from './../../../services/configuracao-comentario.service';
import { Router } from '@angular/router';
import { PcsUtil } from './../../../services/pcs-util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracao-comentario',
  templateUrl: './configuracao-comentario.component.html',
  styleUrls: ['./configuracao-comentario.component.css']
})
export class ConfiguracaoComentarioComponent implements OnInit {

  public formConfiguracaoComentario: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private configuracaoComentarioService: ConfiguracaoComentarioService,
    private titleService: Title,
  ) { this.formConfiguracaoComentario =  this.formBuilder.group({
        tamanhoMaxComentario: [null, Validators.required],
    });
    this.titleService.setTitle("Configurar Testemunhos - Cidades Sustentáveis")
  }

  ngOnInit() {
  }

  public atualizar() {
    const configuracao = this.formConfiguracaoComentario.controls.tamanhoMaxComentario.value;
    this.configuracaoComentarioService.atualizar(configuracao).subscribe(res => {
      PcsUtil.swal()
      .fire({
        title: 'Tamanho máximo dos comentários atualizado!',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      })
      .then(
        result => {
          this.router.navigate(['/participacao-cidada/comentario-administracao']);
        },
        error => {}
      );
    });
  }

}
