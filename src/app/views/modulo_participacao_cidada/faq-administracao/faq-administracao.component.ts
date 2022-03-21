import { faq } from './../../../model/faq';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-faq-administracao',
  templateUrl: './faq-administracao.component.html',
  styleUrls: ['./faq-administracao.component.css']
})
export class FaqAdministracaoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  public dataSource: MatTableDataSource<faq>;
  
  public displayedColumns: string[] = ['pergunta', 'resposta', 'acoes'];

  constructor(
    private faqService: FaqService,
    private titleService: Title,
  ) { 
    this.titleService.setTitle("Administrar FAQ - Cidades Sustentáveis")
    
  }

  ngOnInit() {
    this.buscarFaq()
  }

  buscarFaq() {
    this.faqService.listar()
    .subscribe(res => {
      this.dataSource = new MatTableDataSource<faq>(this.formataRFaq(res));
    });
  }

  private formataRFaq(faqInteiro) {
    let faqFormatado: Array<faq> = [];
      faqInteiro.forEach(faq => {
      faq.pergunta = faq.pergunta.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ' ');
      faq.pergunta = faq.pergunta.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ' ');
      faq.resposta = faq.resposta.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ' ');
      faq.resposta = faq.resposta.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ' ');
      faqFormatado.push(faq)
    })
    return faqFormatado;
  }

  public excluirPergunta(idPergunta: number): void {
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
        this.faqService.excluirFaq(idPergunta).subscribe(response => {
          PcsUtil.swal().fire('Pergunta!', `Excluída com sucesso.`, 'success');
          this.buscarFaq();
        });
      }
    });
  }
}
