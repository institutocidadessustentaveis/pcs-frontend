import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from 'src/app/model/perfil';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PerfisService } from 'src/app/services/perfis.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administracao-responsaveis-form',
  templateUrl: './administracao-responsaveis-form.component.html',
  styleUrls: ['./administracao-responsaveis-form.component.css']
})
export class AdministracaoResponsaveisFormComponent implements OnInit {
  form: FormGroup;
  perfisGestaoPublica: Perfil[] = [];
  cidades = [];
  listaUsuarios: Usuario[] = [];
  usuarioLogado: Usuario = new Usuario();

  constructor( 
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private perfisService: PerfisService, 
    private router: Router,
    private usuarioService: UsuarioService,
    private cidadeService: CidadeService,
    private authService: AuthService) { 
    this.form = this.formBuilder.group({
      id: null,
      nome: ['', Validators.required ],
      email: ['', Validators.required ],
      cargo: ['', Validators.required ],
      telefone: ['', Validators.required ],
      celular: ['', Validators.required ],
      idCidade: ['', Validators.required ],
      perfis: [[], Validators.required ],
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.carregarUsuario();
    this.carregarPerfilsGestaoPublica();
    this.carregarCidades();
    this.buscarUsuariosPrefeitura(this.buscaIdPrefeitura());
    this.usuarioLogado = this.buscarDadosUsuarioLogado();
  }

  public buscarDadosUsuarioLogado() {
    const usuario = JSON.parse(this.authService.getUsuarioLogado());
    return usuario as Usuario;
  }

  carregarCidades() {
    this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe( res => {
      this.cidades = res;
    });
  }

  carregarPerfilsGestaoPublica() {
    this.perfisService.buscarPerfisGestaoPublica().subscribe(perfis => {
      if(this.isPerfilPrefeitura(this.buscarDadosUsuarioLogado())) {
        this.perfisGestaoPublica = perfis
      } else {
        this.perfisGestaoPublica = perfis.filter(perfil => perfil.nome !== 'Responsável pela Prefeitura');
      }
    })
  }

  public buscaIdPrefeitura() : number {
    const usuario = JSON.parse(this.authService.getUsuarioLogado());
    return usuario.dadosPrefeitura.id;
  }

  public buscarUsuariosPrefeitura(idPrefeitura: number) {
    this.usuarioService.buscarListaUsuariosPorPrefeitura(idPrefeitura).subscribe(res => {
      this.listaUsuarios = res;
    });
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
      if(!this.verificarPerfilJaAtribuido(usuario)) {
        this.usuarioService.inserirResponsavel(usuario).subscribe(res => {
        this.confirmarCadastro();
        });
      } 
    } else {
      if(!this.verificarPerfilJaAtribuido(usuario)) {
        this.usuarioService.alterarResponsavel(usuario).subscribe(res => {
          this.confirmarCadastro();
        });
      }
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
          this.router.navigate(['/administracao-responsaveis']);
        },
        error => {
        }
      );
  }

  public verificarPerfilJaAtribuido(usuario): boolean {
    let listaPerfis: {id?: number, nome?: string}[] = [];
    let isAtribuido: boolean = false;
    this.listaUsuarios.forEach(user => {
      user.credencial.listaPerfil.forEach(perfil => {
        let perfilAux = {id: perfil.id, nome: perfil.nome}
        listaPerfis.push(perfilAux)
      });
    });

    listaPerfis.forEach(perfil => {
      if(usuario.perfis.includes(perfil.id)) {
        this.emitirAlertaPerfil(perfil.nome)
        isAtribuido = true;
      }
    });

    return isAtribuido;
  }

  emitirAlertaPerfil(nomePerfil: string) {
    PcsUtil.swal()
    .fire({
      title: 'Perfil já atribuído',
      text: `Já existe um usuário com o perfil ${nomePerfil} atribuído. `,
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok'
    })
    .then(
      result => {
        this.form.controls.perfis.reset();
      },
      error => {
      }
    );
  }

  public isPerfilPrefeitura(usuario): boolean {
    let listaPerfis: string[] = []

    usuario.listaPerfil.forEach(perfil => {
      listaPerfis.push(perfil.nome)
    });

    if(listaPerfis.includes('Responsável pela Prefeitura')){
      return true;
    } else {
      return false;
    }
  }
}
