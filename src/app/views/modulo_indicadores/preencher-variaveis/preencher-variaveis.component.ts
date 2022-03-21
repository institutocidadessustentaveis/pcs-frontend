import { VariavelService } from 'src/app/services/variavel.service';
import { Component, OnInit, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';

@Component({
  selector: 'app-preencher-variaveis',
  templateUrl: './preencher-variaveis.component.html',
  styleUrls: ['./preencher-variaveis.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class PreencherVariaveisComponent implements OnInit {


  public loading = true;
  public listaVariavel: any = [];
  public listaVariavelAux: any = [];
  public listaSubdivisao = [];
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private variavelService: VariavelService,
    private variavelPreenchidaService: VariavelPreenchidaService,
    private subdivisaoService: SubdivisaoService) {
      this.form= this.formBuilder.group({
      subdivisao: [null],
      nome: [''],
      idVariavel: ['']
    });
  }

  ngOnInit() {
    this.carregarVariaveis();
    this.carregarSubdivisoes();
  }

  carregarVariaveis(){
    this.loading = true;
    let idSubdivisao = this.form.controls.subdivisao.value;

    this.variavelPreenchidaService.buscarVariaveisParaPreencher(idSubdivisao).subscribe(res => {
      this.listaVariavel = res;
      this.listaVariavel.forEach(item => {
        item.exibirDados = false ;
        item.dadosCarregados = false;
      });
      this.loading = false;
      this.listaVariavelAux = this.listaVariavel;
    });
  }


  carregarSubdivisoes(){
    this.subdivisaoService.buscarTodosPorCidade().subscribe(res => {
      this.listaSubdivisao = res;
    });
  }

  carregarInformacoes(item){
    item.exibirDados = !item.exibirDados;
  }

  recarregarVariavel(itemAtualizado){
    const anoAtual = new Date().getFullYear() -1;
    if(itemAtualizado.ano == anoAtual){
      this.listaVariavel.forEach(item => {
        if(item.id === itemAtualizado.variavel ){
          item.preenchida = true;
        }
      });
    }
  }
  
  applyFilter(filterValue: any) {

    let busca: string = (this.form.controls.nome.value != null) ? this.form.controls.nome.value : "";
    let id: string = (this.form.controls.idVariavel.value != null) ? this.form.controls.idVariavel.value : "";

    this.listaVariavel = this.listaVariavelAux.filter(item => 
      item.nome.trim().toLowerCase().includes(busca.trim().toLowerCase()) && 
      item.id.toString().includes(id));

    if(id != "") {
      this.listaVariavel = this.listaVariavel.sort((a, b) => (a.id > b.id) ? 1 : -1);
    }
  }
}
