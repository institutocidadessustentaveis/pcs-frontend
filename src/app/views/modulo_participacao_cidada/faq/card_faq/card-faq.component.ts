import { throwError } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { faq } from 'src/app/model/faq';
import { environment } from 'src/environments/environment';
import { $ } from 'protractor';

@Component({
  selector: 'app-card-faq',
  templateUrl: './card-faq.component.html',
  styleUrls: ['./card-faq.component.css']
})
export class CardFaqComponent implements OnInit {
  @Input() idFaq;
  @Input() index;
  @Input() isExpanded;
  public faq: faq;
  dropList: Number[] = [];
  public urlbackend;
  constructor(
    private faqService: FaqService,
  ) {
    this.faq = null;
    this.urlbackend = environment.API_URL;
   }

  ngOnInit() {
    this.buscarFaq()
    this.dropTodos(this.idFaq)
  }

  public buscarFaq() {
    this.faqService.buscarFaqPorId(this.idFaq)
    .subscribe(res => {
      this.faq = res;
    })
  }

  adicionarDrop(id: number){
    if (this.dropList.includes(id)) {
      this.dropList.splice(this.dropList.indexOf(id), 1)
    }
    else {
      this.dropList.push(id);
    }
  }
  
  onDrop(id) {
    
    return this.dropList.includes(id);
  }

  dropTodos(id: number) {
    this.dropList.push(id)
  }

  setClassCSS() {
    if (this.index % 2 == 0) {
      return 'gray-line';
      } else {
       return 'white-line';
      }
  }
}