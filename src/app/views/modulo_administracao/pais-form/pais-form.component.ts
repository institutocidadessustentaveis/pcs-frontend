import { Title } from '@angular/platform-browser';
import { PaisComponent } from '../pais/pais.component';
import { Component, OnInit, ElementRef } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { Pais } from 'src/app/model/pais';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-pais-form',
  templateUrl: './pais-form.component.html',
  styleUrls: ['./pais-form.component.css']
})
export class PaisFormComponent implements OnInit {
  public pais: Pais = new Pais();
  public paisComponent: PaisComponent;
  selecionarContinente: any;
  paises: any[] = [];
  input: any;
  nomeBotao = "Cadastrar";
  paisForm: FormGroup;
  paisJaCadastrado: Boolean = false;
  jaExisteContinente: Boolean = false;
  loading = true;

  continentes = [{
    id: 1, name: 'Africa', paises: ['África do Sul', 'Angola', 'Argélia', 'Benim', 'Botswana', 'Burquina Faso',
    'Burundi', 'Camarões', 'Chade', 'Costa do Marfim', 'Djibouti', 'Egito',
    'Eritreia', 'Eswatini', 'Etiópia', 'Gabão', 'Gâmbia', 'Gana', 'Guiné', 
    'Guiné-Bissau', 'Guiné Equatorial', 'Ilhas de Madagascar', 'Ilhas de Cabo Verde', 
    'Ilha de Comores', 'Ilhas de São Tomé e Príncipe', 'Ilhas Seychelles', 'Lesoto', 
    'Libéria','Líbia', 'Malawi', 'Mali', 'Marrocos', 'Mauritânia', 'Moçambique', 
    'Namíbia', 'Níger', 'Nigéria', 'Quênia', 'República Centro-Africana', 
    'República Democrática do Congo', 'República do Congo', 'República de Maurício', 
    'Ruanda', 'Senegal', 'Serra Leoa', 'Somália', 'Sudão', 'Sudão do Sul',
    'Tanzânia', 'Togo', 'Tunísia', 'Uganda', 'Zâmbia', 'Zimbábue'
    ]
  },
  {
    id: 2, name: 'America', paises: [
    'Antígua e Barbuda', 'Argentina', 'Bahamas', 'Barbados', 'Belize', 
    'Bolívia','Brasil', 'Canadá', 'Chile', 'Colômbia', 'Costa Rica', 'Cuba', 'Dominica', 
    'El Salvador', 'Equador', 'Estados Unidos', 'Guiana', 'Granada', 'Guatemala', 
    'Haiti', 'Honduras', 'Jamaica', ' México', 'Nicarágua', 'Panamá', ' Paraguai', 'Peru', ' República Dominicana', 
    'Santa Lúcia', 'São Cristóvão e Névis', 'São Vicente e Granadinas', 
    'Suriname', 'Uruguai', 'Trinidad e Tobago', 'Venezuela']
  },
  {
    id: 3, name: 'Ásia', paises: [
      'Afeganistão', 'Arábia Saudita', 'Armênia', 'Azerbaijão', 'Bahrein', 'Bangladesh',
      'Brunei', 'Butão', 'Camboja', 'Cazaquistão', 'Catar', 'China', 'Cingapura', 
      'Coreia do Norte', 'Coreia do Sul', 'Emirados Árabes', 'Filipinas', 'Iêmen', 
      'Índia', 'Indonésia', 'Irã', 'Iraque', 'Israel', 'Japão', 'Jordânia', 'Kuwait', 
      'Laos', 'Líbano', 'Malásia', 'Maldivas', 'Mianmar', 'Mongólia', 'Nepal', 'Omã', 
      'Paquistão', 'Quirguistão', 'Síria', 'Sri Lanka', 'Tajiquistão', 'Tailândia', 
      'Turcomenistão', 'Turquia', 'Uzbequistão', 'Vietnã']
  },
  {
    id: 4, name: 'Europa', paises: [
      'Albânia', 'Alemanha', 'Andorra', 'Áustria', 'Bélgica', 'Bielorrússia',
      'Bósnia e Herzegovina', 'Bulgária', 'Chipre', 'Croácia', 'Dinamarca', 'Escócia', 
      'Eslováquia', 'Eslovênia', 'Espanha', 'Estônia', 'Finlândia', 'França', 'Grécia', 'Holanda',
      'Hungria', 'Inglaterra', 'Irlanda', 'Irlanda do Norte', 'Islândia', 'Itália', 'Letônia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 
      'Macedônia do Norte', 'Malta', 'Moldávia', 'Mônaco', 'Montenegro', 'Noruega', 'País Basco',
      'País de Gales', 'Polônia', 'Portugal', 'República Tcheca', 
      'Romênia', 'Rússia', 'San Marino', 'Sérvia', 'Suécia', 'Suíça', 
      'Ucrânia ', 'Vaticano']
  },
  {
    id: 5, name: 'Oceania', paises: [
      'Austrália', 'Estados Federados da Micronésia', 'Fiji', 'Ilhas Marshall', 'Ilhas Salomão', 
      'Kiribati','Nauru', 'Nova Zelândia', 'Palau', 'Papua-Nova Guiné ', 'Samoa', 'Tonga', 
      'Tuvalu', 'Vanuatu'
    ]
  }];
  scrollUp: any;

  ngOnInit() {
    this.carregaLista();
    if (location.pathname.includes('editar')) {
      this.dadosEditar();
    }
  }

  onChange() {
    for (const item in this.continentes) {
      if (this.continentes[item].name === this.paisForm.controls["continente"].value) {
        this.paises = this.continentes[item].paises;
      }
    }
  }

  async carregaLista() {
    const obj = JSON.parse(localStorage.getItem('dadosCadastrados'));
    this.paisForm.controls['pais'].setValue(obj.pais);
    await this.onChange();
  }

  escolhaPais(nomePais) {
    const dadosCadastrados = JSON.parse(localStorage.getItem('dadosCadastrados'));
    const verifica = dadosCadastrados.filter(x => x.nome === nomePais);
    if (verifica.length > 0) {
      this.paisJaCadastrado = true;
    } else {
      this.paisJaCadastrado = false;
    }
  }

  constructor(
    public paisService: PaisService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private titleService: Title,) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    this.paisForm = this.formBuilder.group({
      pais: ['', Validators.required],
      continente: [],
      populacao: []
    });
    this.titleService.setTitle("Formulário de País - Cidades Sustentáveis")
  }

  async dadosEditar() {
    this.nomeBotao = 'Editar';
    let obj = JSON.parse(localStorage.getItem('editar-obj'));
    if(obj.continente){
      this.jaExisteContinente = true;
    }else{
      this.jaExisteContinente = false;
    }
    this.paisForm.controls['continente'].setValue(obj.continente);
    await this.onChange();
    this.paisForm.controls['pais'].setValue(obj.nome);
    this.titleService.setTitle(`Detalhes do País - ${obj.nome} - Cidades Sustentáveis`);
    this.paisForm.controls['populacao'].setValue(obj.populacao);
  }

  async editarPais() {
    this.pais.id = JSON.parse(localStorage.getItem('editar-obj')).id;
    this.pais.continente = this.paisForm.controls['continente'].value;
    this.pais.nome = this.paisForm.controls['pais'].value;
    this.pais.populacao = this.paisForm.controls["populacao"].value;
    await this.paisService.editarPais(this.pais).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'País',
        text: `País ${this.pais.nome} atualizado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/pais']);
      }, error => { });
    });
  }

  async cadastrarPais() {
    this.pais.continente = this.paisForm.controls["continente"].value;
    this.pais.nome = this.paisForm.controls["pais"].value;
    this.pais.populacao = this.paisForm.controls["populacao"].value;
    await this.paisService.inserirPais(this.pais).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'País',
        text: `País ${this.pais.nome} cadastrado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/pais']);
      }, error => { });
    });
  }


}
