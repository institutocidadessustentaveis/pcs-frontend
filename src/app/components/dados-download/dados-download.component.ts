import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';
import { CidadeService } from 'src/app/services/cidade.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service'
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dados-download',
  templateUrl: './dados-download.component.html',
  styleUrls: ['./dados-download.component.css']
})
export class DadosDownloadComponent implements OnInit {

form: FormGroup;

idCidadeSelecionado: number;
nomeCidadeSelecionada: string;
filteredOptions: Observable<any>;
options = [];

dadosDownload: DadosDownload = new DadosDownload;

  constructor(public dialogRef: MatDialogRef<DadosDownloadComponent>,
              private formBuilder: FormBuilder,
              private cidadeService: CidadeService,
              @Inject(MAT_DIALOG_DATA) private modalData: any,
              private dadosDownloadService: DadosDownloadService,
              public router: Router
              ) { 
               this.form = this.formBuilder.group({
                  cidade: [null, Validators.required],
                  email: [null, [Validators.required,
                          Validators.email, 
                          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')] ],
                  nome: [null, Validators.required],
                  organizacao: [null],
                  boletim: ['true', Validators.required]
                  });
              }

              

  ngOnInit() {
    this.carregarComboCidades();
    
  }

  adicionarDados() {
    //Populando pelo formulario
    if(this.idCidadeSelecionado){
      this.dadosDownload.cidade = this.idCidadeSelecionado;
      this.dadosDownload.nomeCidade = this.nomeCidadeSelecionada;
    } else {
      this.dadosDownload.cidade = null;
      this.dadosDownload.nomeCidade = this.form.controls.cidade.value;
    }
    this.dadosDownload.email = this.form.controls.email.value;
    this.dadosDownload.nome = this.form.controls.nome.value;
    this.dadosDownload.organizacao = this.form.controls.organizacao.value;
    this.dadosDownload.boletim = this.form.controls.boletim.value;
    
    //Populando pela inject
    this.dadosDownload.acao = this.modalData.acao;
    this.dadosDownload.pagina = this.modalData.pagina;
    this.dadosDownload.arquivo = this.modalData.arquivo;

   
    this.cadastrarDadosDownload(this.dadosDownload);
    this.salvarDadosLocalStorage(this.dadosDownload);
    this.dialogRef.close(this.dadosDownload);
    
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  closeModal() {
    this.dialogRef.close(null);
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }
 
  public carregarComboCidades() {
    this.filteredOptions = this.form.get('cidade')!.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    this.cidadeService.buscarCidadeComboBox().subscribe(cidades => {
      this.options = cidades;
      this.filteredOptions = this.form.get('cidade')!.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filter(label) : this.options.slice())
      );
    })

  }

  public setCidadeSelecionada(cidade) {
    this.idCidadeSelecionado = cidade.id;
    this.nomeCidadeSelecionada = cidade.label;
  }

  public getTextoExibicaoCidade(cidade?): string | undefined {
    return cidade ? cidade.label : undefined;
  }

  public salvarDadosLocalStorage(dados: DadosDownload) {
    localStorage.setItem('dadosDownload', JSON.stringify(dados));
  }

}
  

 
 

