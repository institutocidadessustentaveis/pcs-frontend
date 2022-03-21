import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FormularioAtendimento } from 'src/app/model/formulario-atendimento';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { FormularioAtendimentoService } from 'src/app/services/formulario-atendimento.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-atendimento',
  templateUrl: './formulario-atendimento.component.html',
  styleUrls: ['./formulario-atendimento.component.css']
})
export class FormularioAtendimentoComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private usuarioService: UsuarioService,
    private formularioAtendimentoService: FormularioAtendimentoService,
    private titleService: Title
    ) { 
      this.form = this.formBuilder.group({
        nomeContato: [null, Validators.required],
        emailContato: [null, [
          Validators.required,
          Validators.email, 
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ],
        telContato: [null],
        solicitacao: [null, Validators.required]
      })

      this.titleService.setTitle("Formulário de Atendimento - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.preencheimentoAutomaticoUsuarioLogado();
  }

  public preencheimentoAutomaticoUsuarioLogado(){
    if(this.authService.isAuthenticated) {
      
      this.usuarioService.buscarUsuarioLogado().subscribe(res => {
        const user = res as Usuario;
        this.form.controls.nomeContato.setValue(user.nome);
        this.form.controls.emailContato.setValue(user.email);
        this.form.controls.telContato.setValue(user.telefone);
      })
    }
  }

  public salvar() {
    const formularioAtendimento = new FormularioAtendimento();

    formularioAtendimento.nomeContato = this.form.controls.nomeContato.value;
    formularioAtendimento.emailContato = this.form.controls.emailContato.value;
    formularioAtendimento.telContato = this.form.controls.telContato.value;
    formularioAtendimento.solicitacao = this.form.controls.solicitacao.value;

    const mensagemAlerta = this.criarMensagemDeAlerta(formularioAtendimento.nomeContato,  formularioAtendimento.emailContato, formularioAtendimento.telContato)

    PcsUtil.swal().fire({
      title: 'Antes de continuar, confirme seus dados',
      html: mensagemAlerta,
      type: 'info',
      showCancelButton: true,
      heightAuto: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if(result.value) {
        this.formularioAtendimentoService.salvar(formularioAtendimento).subscribe(res => {
          if(res){
            PcsUtil.swal().fire({
              title: 'Cadastro feito com sucesso',
              text: `Sua solicitação foi cadastrada com sucesso`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            });
            this.form.controls.solicitacao.setValue('');
          }
        });
      }
    });

    
  }

  public criarMensagemDeAlerta(nome: string, email: string, tel: string) {
    const mensagem = `<p>Nome: <strong> ${nome} </strong>  </p> <p>E-mail: <strong> ${email} </strong> </p> <p>Telefone: <strong> ${tel} </strong> </p>`
    return mensagem;
  }

  

}
