import { Title } from '@angular/platform-browser';
import { Funcionalidade } from '../../../model/funcionalidade';
import { Component, OnInit, ElementRef } from '@angular/core';

import { Permissao } from 'src/app/model/permissao';
import { Perfil } from 'src/app/model/perfil';
import { PerfisService } from 'src/app/services/perfis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfilForm.component.html',
  styleUrls: ['./perfilForm.component.css']
})
export class PerfilFormComponent implements OnInit {

  listaPermissoes: Permissao[];
  perfil: Perfil = new Perfil();
  funcionalidades: Funcionalidade[] = [];
  checked: boolean = false;
  scrollUp: any;

  constructor(
    private perfisService: PerfisService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private titleService: Title) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
      this.titleService.setTitle("Formulário de Perfil - Cidades Sustentáveis");
  }

  ngOnInit() {
    this.buscarPerfil();
  }

  private buscarPerfil(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;

      if (id) {
        this.perfisService.buscarPerfil(id).subscribe((perfil) => {
          this.perfil = perfil;
          this.titleService.setTitle(`Detalhes do Perfil ${this.perfil.nome} - Cidades Sustentáveis`)
        });
      } else {
        this.perfisService.buscarFuncionalidades().subscribe(response => {
          this.funcionalidades = response;
          this.carregarNovasPermissoes();
        });
      }
    });
  }

  private carregarNovasPermissoes(): void {
    this.listaPermissoes = [];
    for (const funcionalidade of this.funcionalidades) {
      const permissao: Permissao = new Permissao();
      permissao.funcionalidade = funcionalidade;
      permissao.habilitada = false;
      this.listaPermissoes.push(permissao);
    }
    this.perfil.permissoes = this.listaPermissoes;
  }

  public setarHabilitada(funcionalidade: Funcionalidade) {
    for (let permissao of this.perfil.permissoes) {
      if (permissao.funcionalidade.id === funcionalidade.id) {
        if (this.perfil.id === 1 && (funcionalidade.nome === 'Editar Perfil' || funcionalidade.nome === 'Visualizar Perfil')) {
          permissao.habilitada = true;
        } else if (this.perfil.id === 1 && (funcionalidade.nome === 'Cadastrar Plano de Metas')){
          permissao.habilitada = false;
        } else if (permissao.habilitada) {
          permissao.habilitada = false;
        } else {
          permissao.habilitada = true;
        }
      }
    }
  }
  public salvarPerfil() {
    if (this.perfil.id) {
      this.editarPerfil();
    } else {
      this.cadastrarPerfil();
    }
  }

  public editarPerfil(): void {
    this.perfisService.editar(this.perfil).subscribe(perfil => {
      PcsUtil.swal().fire({
        title: 'Perfil',
        text: `Perfil ${this.perfil.nome} atualizado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/perfis'])
      }, error => { });
    })
  }

  public cadastrarPerfil(): void {
    this.perfisService.inserir(this.perfil).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Perfil',
        text: `Perfil ${this.perfil.nome} cadastrado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/perfis'])
      }, error => { });
    });
  }

  public selectAll(checked): void {
    this.checked = checked === false ? true : false;
    if (this.checked) {
      for (let permissao of this.perfil.permissoes) {
        if (this.perfil.id === 1 && permissao.funcionalidade.nome === 'Cadastrar Plano de Metas'){
          permissao.habilitada = false;
        } else {
          permissao.habilitada = true;
        }
      }
    } else {
      for (let permissao of this.perfil.permissoes) {
        if (this.perfil.id === 1 && (permissao.funcionalidade.nome === 'Editar Perfil' ||
        permissao.funcionalidade.nome === 'Visualizar Perfil')) {
          permissao.habilitada = true;
        } else {
          permissao.habilitada = false;
        }
      }
    }
  }
}
