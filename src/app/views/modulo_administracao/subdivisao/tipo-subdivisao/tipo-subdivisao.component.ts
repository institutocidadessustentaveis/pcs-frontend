import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { TipoSubdivisao } from 'src/app/model/tipoSubdivisao';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { TipoSubdivisaoService } from 'src/app/services/tipoSubdivisao.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-tipo-subdivisao',
  templateUrl: './tipo-subdivisao.component.html',
  styleUrls: ['./tipo-subdivisao.component.css']
})
export class TipoSubdivisaoComponent implements OnInit {

  public formTipoSubdivisao: FormGroup;
  public displayedColumns: string[] = ['nome', 'nivel', 'tipoPai', 'acoes'];
  public dataSource: MatTableDataSource<TipoSubdivisao>;
  public tiposSubdivisoes;
  public tiposSubdivisoesPai = [];
  public usuario: Usuario;
  public canEditar = false;
  public canExcluir = false;
  public canCadastrar = false;
  public maiorNivel;
  
  constructor(
    private formBuilder: FormBuilder,
    private tipoSubdivisaoService: TipoSubdivisaoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
      ) { 
    this.formTipoSubdivisao = this.formBuilder.group({
      id: [null],
      nome: [null],
      nivel: [{value: null, disabled: true}],
      tipoPai: [null],
    })
  }

  ngOnInit() {   
    this.buscarTiposSubdivisoes();
  }

  public buscarMaiorNumeroDaLista(){
    if(this.tiposSubdivisoes.length > 0){
      this.maiorNivel = Math.max.apply(Math, this.tiposSubdivisoes.map(function(tipoSubdivisao) { return tipoSubdivisao.nivel; }));
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel + 1);
    }else {
      this.maiorNivel = 1;
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel);
    }
    
  }

  public filtrarPossiveisTiposSubdivisoesPai(){
    let lista = [];
    this.tiposSubdivisoes.forEach(tipoSubdivisao => {
      if(tipoSubdivisao.nivel == this.maiorNivel){
        lista.push(tipoSubdivisao);
      }
    });
    this.tiposSubdivisoesPai = lista;
  }

  public adicionarSubdivisaoRelacionada(tipoSubdivisao){
    this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel + 1);
    this.formTipoSubdivisao.controls.tipoPai.setValue(tipoSubdivisao.id);
  }

  //Corrigir
  public onChangeTipoSubdivisao(tipoPai) {
    if(this.tiposSubdivisoes.length > 0){
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel + 1);
      this.formTipoSubdivisao.controls.tipoPai.setValue(tipoPai);
    }else {
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel);
      this.formTipoSubdivisao.controls.tipoPai.setValue(tipoPai);
    }   
  }

  public exibirNomeTipoPai(tipoPai){
    let pai;
    this.tiposSubdivisoes.forEach(tipoSubdivisao => {
      if (tipoSubdivisao.id == tipoPai) {
        pai = tipoSubdivisao.nome
    }
  }); 

    return pai;
  }

  public verificarRole() {
    if (this.usuario) {
      let usuario = JSON.parse(this.authService.getUsuarioLogado());
      if (usuario.roles.includes('ROLE_EDITAR_TIPO_SUBDIVISAO')) {
        this.canEditar = true;
      }
      if (usuario.roles.includes('ROLE_CADASTRAR_TIPO_SUBDIVISAO') || usuario.roles.includes('ROLE_EDITAR_TIPO_SUBDIVISAO')) {
        this.canCadastrar = true;
      }
      if (usuario.roles.includes('ROLE_EXCLUIR_TIPO_SUBDIVISAO')) {
        this.canExcluir = true;
      }
    }
  }

  public salvarTipoSubdivisao(){
    if(this.formTipoSubdivisao.controls.id.value){
      this.atualizarSubDivisao();
    }else {
      this.cadastrarSubdivisao();
    }
  }

  public cadastrarSubdivisao(){
    let tipoSubdivisao = new TipoSubdivisao();
    tipoSubdivisao.nome = this.formTipoSubdivisao.controls.nome.value;
    tipoSubdivisao.nivel = this.formTipoSubdivisao.controls.nivel.value;
    tipoSubdivisao.tipoPai = this.formTipoSubdivisao.controls.tipoPai.value;

    if (this.formTipoSubdivisao.controls.tipoPai.value) {
      tipoSubdivisao.tipoPai = this.formTipoSubdivisao.controls.tipoPai.value;
    } else {
      this.tiposSubdivisoes.forEach(tipoSubdivisaoObject => {
        if (tipoSubdivisaoObject.nivel == this.maiorNivel) {
          tipoSubdivisao.tipoPai = tipoSubdivisaoObject.id;
        }
      });
    }
    

    this.tipoSubdivisaoService.cadastrarTipoSubdivisao(tipoSubdivisao).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Tipo de Subdivisão',
        text: `Cadastrado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
      this.buscarTiposSubdivisoes();
      this.formTipoSubdivisao.reset();
    });
  }

  public atualizarSubDivisao(){
    let tipoSubdivisao = new TipoSubdivisao();
    tipoSubdivisao.id = this.formTipoSubdivisao.controls.id.value;
    tipoSubdivisao.nome = this.formTipoSubdivisao.controls.nome.value;
    tipoSubdivisao.nivel = this.formTipoSubdivisao.controls.nivel.value;
    tipoSubdivisao.tipoPai = this.formTipoSubdivisao.controls.tipoPai.value;

    this.tipoSubdivisaoService.editarTipoSubdivisao(tipoSubdivisao).subscribe(res => {
      PcsUtil.swal().fire({
        title: 'Tipo de Subdivisão',
        text: `Atualizado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
      this.buscarTiposSubdivisoes();
      this.formTipoSubdivisao.reset();
    })
  }

  public buscarTiposSubdivisoes() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;
      
      this.tipoSubdivisaoService.buscarTodosPorPrefeituraId(this.usuario.prefeitura.id).subscribe(tipoSubdivisao => {
        this.dataSource = new MatTableDataSource<TipoSubdivisao>(tipoSubdivisao);
        this.tiposSubdivisoes = tipoSubdivisao;
        this.buscarMaiorNumeroDaLista();   
        this.filtrarPossiveisTiposSubdivisoesPai();     
      }, error => {
        this.router.navigate(['/institucional']);
      });
      this.verificarRole();
    })
  }

  public editar(tipoSubdivisao: TipoSubdivisao){
    this.tiposSubdivisoes.forEach(tipoSubdivisaoObj => {
      if(tipoSubdivisaoObj.id == tipoSubdivisao.tipoPai){
        this.tiposSubdivisoesPai = []
        this.tiposSubdivisoesPai.push(tipoSubdivisaoObj);
      }
    });
    this.formTipoSubdivisao.reset();
    this.formTipoSubdivisao.controls.id.setValue(tipoSubdivisao.id);
    this.formTipoSubdivisao.controls.nome.setValue(tipoSubdivisao.nome);
    this.formTipoSubdivisao.controls.nivel.setValue(tipoSubdivisao.nivel);
    this.formTipoSubdivisao.controls.tipoPai.setValue(tipoSubdivisao.tipoPai);
  }

  public excluir (id){
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.tipoSubdivisaoService.excluirTipoSubdivisao(id).subscribe(response => {
          PcsUtil.swal().fire('Tipo de Subdivisão!', `Excluído com sucesso.`, 'success');
          this.buscarTiposSubdivisoes();
        });
      }
    });
    this.limparFormulario();
  }

  public limparFormulario(){
    this.formTipoSubdivisao.reset();
    if(this.tiposSubdivisoes.length > 0){
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel + 1);
    }else {
      this.formTipoSubdivisao.controls.nivel.setValue(this.maiorNivel);
    }  
    this.filtrarPossiveisTiposSubdivisoesPai();    
  }

}
