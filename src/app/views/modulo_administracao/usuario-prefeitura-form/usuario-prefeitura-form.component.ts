import { Component, OnInit, ElementRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PerfisService } from 'src/app/services/perfis.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Perfil } from 'src/app/model/perfil';

@Component({
  selector: 'app-usuario-prefeitura-form',
  templateUrl: './usuario-prefeitura-form.component.html',
  styleUrls: ['./usuario-prefeitura-form.component.css']
})
export class UsuarioPrefeituraFormComponent implements OnInit {
  form: FormGroup;
  cidades = [];
  perfisGestaoPublica: Perfil[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private cidadeService: CidadeService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private perfisService: PerfisService, 
    private router: Router) {

      this.form = this.formBuilder.group({
        id: null,
        nome: ['', Validators.required ],
        email: ['', Validators.required ],
        cargo: [''],
        telefone: [''],
        celular: [''],
        idCidade: ['', Validators.required ],
        perfis: [[], Validators.required ],
      });
     }


  ngOnInit() {
    this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe( res => {
      this.cidades = res;
    });
    this.carregarUsuario();
    this.carregarPerfilsGestaoPublica();
  }

  carregarPerfilsGestaoPublica() {
    this.perfisService.buscarPerfisGestaoPublica().subscribe(perfis => {
      this.perfisGestaoPublica = perfis;
    })
  }

  carregarUsuario() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.usuarioService.buscarUsuarioSimples(id).subscribe(res => {
          const usuario = res;
          this.form.controls.id.setValue(usuario.id);
          this.form.controls.nome.setValue(usuario.nome);
          this.form.controls.email.setValue(usuario.email);
          this.form.controls.cargo.setValue(usuario.cargo);
          this.form.controls.telefone.setValue(usuario.telefone);
          this.form.controls.celular.setValue(usuario.celular);
          this.form.controls.idCidade.setValue(usuario.idCidade);
          this.form.controls.perfis.setValue(usuario.perfis);
        });
      }

    });
  }

  salvar() {
    const usuario = this.form.value;
    if (usuario.id == null) {
      this.usuarioService.inserirResponsavel(usuario).subscribe(res => {
        this.confirmarCadastro();
      });
    } else {
      this.usuarioService.alterarResponsavel(usuario).subscribe(res => {
        this.confirmarCadastro();
      });
    }
  }

  confirmarCadastro() {
    PcsUtil.swal()
      .fire({
        title: 'Registro Salvo',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      })
      .then(
        result => {
          this.router.navigate(['/usuario-prefeitura']);
        },
        error => {
        }
      );
  }
}
