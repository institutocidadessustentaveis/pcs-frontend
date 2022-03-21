import { throwError } from 'rxjs';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Title } from '@angular/platform-browser';
import { TemaForumService } from './../../../services/tema-forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TemaForum } from 'src/app/model/tema-forum';

@Component({
  selector: 'app-temas-forum-form',
  templateUrl: './temas-forum-form.component.html',
  styleUrls: ['./temas-forum-form.component.css']
})
export class TemasForumFormComponent implements OnInit {

  public form: FormGroup;
  public temaForum = new TemaForum();

  public modoEdicao = false;
  public temaForumDiscussaoParaEditar: TemaForum = new TemaForum();
  public loading = false;

  constructor(
    public router: Router,
    private temaForumService: TemaForumService,
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Formulário de Temas de Fórum - Cidades Sustentáveis');
    this.buscarTemaForum();
  }

  public buscarTemaForum() {
    this.activatedRoute.params.subscribe(
      async params => {
        let id = params.id;
        if (id) {
          this.temaForum.id = id;
          this.loading = true;
          this.temaForumService.buscarParaEdicao(id).subscribe(
            async response => {
              this.temaForumDiscussaoParaEditar = response as TemaForum;
              this.modoEdicao = true;
              this.carregarAtributosTemaForum();
              this.loading = false;
            },
            error => {
              this.router.navigate(['/biblioteca/temas-forum']);
            }
          );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(['/biblioteca/temas-forum']);
      }
    );
  }

  carregarAtributosTemaForum() {
    this.form.controls.nome.setValue(
      this.temaForumDiscussaoParaEditar.nome
    );
  }

  salvar() {
    this.temaForum.nome = this.form.controls.nome.value;

    if (this.modoEdicao) {
      this.editarTemaForum();
    } else {
      this.cadastrarTemaForum();
    }
  }

  cadastrarTemaForum() {
    this.temaForumService.cadastrar(this.temaForum).subscribe(res => {
      PcsUtil.swal().fire('Tema de Fórum Criado', '', 'success').then(ok => {
        this.router.navigate(['/biblioteca/temas-forum']);
      });

    }, error => {
      PcsUtil.swal().fire('Não foi possível cadastrar o tema do fórum', error.error.message, 'error');
    });
  }

  editarTemaForum() {
    this.temaForumService.editar(this.temaForum).subscribe(res => {
      PcsUtil.swal().fire('Tema de Fórum Editado', '', 'success').then(ok => {
        this.router.navigate(['/biblioteca/temas-forum']);
      });

    }, error => {
      PcsUtil.swal().fire('Não foi possível editar o tema do fórum', error.error.message, 'error');
    });
  }

}
