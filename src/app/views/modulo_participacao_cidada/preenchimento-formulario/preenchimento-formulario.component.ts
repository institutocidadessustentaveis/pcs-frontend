import { FormularioPreenchidoService } from './../../../services/formulario-preenchido.service';
import { FormularioService } from './../../../services/formulario.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preenchimento-formulario',
  templateUrl: './preenchimento-formulario.component.html',
  styleUrls: ['./preenchimento-formulario.component.css']
})
export class PreenchimentoFormularioComponent implements OnInit {

  carregando = true;
  formulario: any = {};
  formularioSecao = [];
  mapCheckbox = new Map();
  mapFormulariosOk = new Map();
  habilitarSalvar = false;
  dataValida = true;
  statusFormulario = false
  statusFormularioInicio = false
  public url = environment.API_URL;
  
  scrollUp: any;
  siteKey = '6LdtHrIUAAAAAHbWoQPwJCusVNVAer7Vo22rYT-u';
  captcha: any = '';
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  constructor(private authService: AuthService,
              private formularioService: FormularioService,
              private formularioPreenchidoService: FormularioPreenchidoService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private element: ElementRef,
              private titleService: Title,) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const link = params.link;
      this.formularioService.buscarPorLink(link).subscribe(res => {
        this.formulario = res;
        this.validarDataAtual(res);
        this.validacoes();
        this.titleService.setTitle(`Formulário - ${this.formulario.nome}`);
        if (this.formulario.secoes) {
          for (let i = 0 ; i < this.formulario.secoes.length; i++) {
            const secao = this.formulario.secoes[i];
            const form = this.formBuilder.group({});
            if (secao.perguntas) {
              secao.perguntas.forEach( pergunta => {
                switch (pergunta.tipo) {
                  case 'Multiplo':
                    if (pergunta.multiplaSelecao) {
                      form.addControl(`${pergunta.id}`, new FormControl(null, [Validators.required]));
                    } else {
                      form.addControl(`${pergunta.id}`, new FormControl(null, [Validators.required]));
                    }
                    break;
                  case 'MultiploOutro':
                    form.addControl(`${pergunta.id}`, new FormControl(null));
                    form.addControl(`${pergunta.id}-outro`, new FormControl(null));
                    break;
                  default:
                    form.addControl(`${pergunta.id}`, new FormControl(null, Validators.required));
                    break;
                }
              });
            }
            this.formularioSecao.push(form);
          }
        }
        this.carregando = false;
      });
    });
  }

  salvar() {
    const listaRespostas = [];
    for (const form of this.formularioSecao) {
      const valores = form.value;
      for (const key in valores) {
        if (this.mapCheckbox.has( parseInt(key) )) {
          const obj = {
            key : key,
            valores: this.mapCheckbox.get( parseInt(key)) };
          listaRespostas.push(obj);
        } else {
          const obj = {
            key : key,
            valores: [valores[key]] };
          listaRespostas.push(obj);
        }
      }
    }
    this.formularioPreenchidoService.salvar(listaRespostas, this.formulario.link).subscribe(res => {
      localStorage.setItem(`formulario-${this.formulario.nome}`, 'true')
      PcsUtil.swal().fire('Formulário salvo com sucesso', '', 'success').then(a => {
        this.router.navigate(['/inicial/home']);
      });
    });
  }

  selecionarCheckbox(pergunta, resposta) {
    if (this.mapCheckbox.has(pergunta)) {
      const valores: any[] = this.mapCheckbox.get(pergunta);
      if (valores.indexOf(resposta) < 0) {
        valores.push(resposta);
      } else {
        const indexResposta = valores.indexOf(resposta);
        valores.splice(indexResposta, 1);
        if (valores.length == 0) {
          this.mapCheckbox.delete(pergunta);
        }
      }
    } else {
      this.mapCheckbox.set(pergunta, [resposta] );
    }
  }

  alterarValorTextoOutro(formulario, pergunta) {
    formulario.controls[pergunta + '-outro'].setValue(null);
  }
  limparValorRadioOutro(formulario, pergunta) {
    if (formulario.controls[pergunta + '-outro'].value.trim() === ''){
      formulario.controls[pergunta + '-outro'].setValue(null);
    } else {
      formulario.controls[pergunta].setValue(null);
    }
  }

  liberarBotaoFormulario(formulario, indiceSecoes) {
    const valoresForm = formulario.value;
    // tslint:disable-next-line: forin
    for (const key in valoresForm) {
      const valor = valoresForm[key];
      if (!valor) {
        if (key.includes('-outro')) {
          const key2 = key.replace('-outro', '');
          const valor2 = valoresForm[key2];
          if (!valor2) {
            if (!this.mapCheckbox.has(key2)) {
              this.mapFormulariosOk.set(indiceSecoes, false);
              this.podeSalvar();
              return false;
            }
          }
        } else {
          if (!this.mapCheckbox.has(key)) {
            const existeOutro = valoresForm.hasOwnProperty(key + '-outro');
            if (existeOutro) {
              const valor2 = valoresForm[key + '-outro'];
              if (!valor2) {
                this.mapFormulariosOk.set(indiceSecoes, false);
                this.podeSalvar();
                return false;
              }
            } else {
              this.mapFormulariosOk.set(indiceSecoes, false);
              this.podeSalvar();
              return false;
            }
          }
        }
      }
    }
    this.mapFormulariosOk.set(indiceSecoes, true);
    
    this.podeSalvar();
    if(this.formularioSecao.length <= 1) {
      return false;
    }
    return true;
  }

  validarDataAtual(formulario){
    
    const now = new Date();
    const dataFim = new Date(formulario.fimPeriodoAtividade)
    const dataInicio = new Date(formulario.inicioPeriodoAtividade)

    if(now > dataFim) {
      this.dataValida = false;
      this.statusFormulario = true;
      PcsUtil.swal().fire('Data limite', 'Não será possível responder este formulário pois sua data limite para resposta já foi ultrapassada.', 'warning').then(a => {
        this.router.navigate(['/']);
      });
    } else if (now < dataInicio) {
      this.statusFormularioInicio = true;
      PcsUtil.swal().fire('Formulário ainda não está ativo', 'Não será possível responder este formulário pois ainda não está ativo', 'warning').then(a => {
        this.router.navigate(['/']);
      });
    } else {
      this.dataValida = true;
      this.statusFormulario = false;
      this.statusFormularioInicio = false;
    }
  }

  podeSalvar() {
    const keysFormularios: any =  Array.from(this.mapFormulariosOk.keys());
    for (const key of keysFormularios) {
      const valor = this.mapFormulariosOk.get(key);
      if (!valor) {
        this.habilitarSalvar = false;
        return;
      } 
    }
    this.habilitarSalvar = true;
  }

  validacoes() {
    const estaAutenticado  = this.authService.isAuthenticated();
    const ehPrefeitura  = this.authService.isUsuarioPrefeitura();
    const ehAdmin = this.authService.hasPerfil('Administrador');
    const ehCidadao = this.authService.hasPerfil('Cidadão');
    if (this.formulario) {
      if(!this.formulario.publicado) {
        PcsUtil.swal().fire('Formulário Indisponível', '', 'warning').then(a => {
          this.router.navigate(['/']);
        });
      }
  
      if (this.formulario.apenasAutenticados && !estaAutenticado) {
        PcsUtil.swal().fire('Você precisa fazer login antes de preencher esse formulário', '', 'warning').then(a => {
          this.router.navigate(['/login']);
        });
      }
      switch (this.formulario.tipoUsuario) {
        case 'prefeitura':
          if (!ehPrefeitura) {
            PcsUtil.swal().fire('Você não pode preencher esse formulário', '', 'warning').then(a => {
              this.router.navigate(['/']);
            });
          }
        break;
        case 'cidadao':
          if (!ehCidadao) {
            PcsUtil.swal().fire('Você não pode preencher esse formulário', '', 'warning').then(a => {
              this.router.navigate(['/']);
            });
          }
        break;
      }
      if (localStorage.getItem(`formulario-${this.formulario.nome}`) == 'true') {
        PcsUtil.swal().fire('Você já preencheu este formulário', '', 'error').then(a => {
          this.router.navigate(['/inicial/home']);
        });
      }
    } else {
      PcsUtil.swal().fire('Formulário indisponível', '', 'error').then(a => {
        this.router.navigate(['/inicial/home']);
      });
    }
  }

  handleSuccess(evento) {
    this.captcha = evento;
  }

  formatarStringInterpolacao(stringList){
    let stringFormatada = '';

    stringList.forEach((string, index) => {
      if(index == 0){
        stringFormatada = stringFormatada + string;
      }
      else {
        stringFormatada = stringFormatada + '; ' + string;
      }
    });   
   
    return stringFormatada;
  }

  formatardata(data) {
    moment.locale('pt');
   

     moment.updateLocale('pt', {
      months : [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
          "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ]
  });

    return moment(data).format('DD [de] MMMM [de] YYYY');  
  }

  public gerarLinkImagemODS(odsId) {
    return `${environment.API_URL}ods/imagem/${odsId}`;
  }

}
