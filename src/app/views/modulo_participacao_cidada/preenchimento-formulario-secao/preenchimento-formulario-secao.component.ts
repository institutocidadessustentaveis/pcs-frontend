import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-preenchimento-formulario-secao",
  templateUrl: "./preenchimento-formulario-secao.component.html",
  styleUrls: ["./preenchimento-formulario-secao.component.css"],
})
export class PreenchimentoFormularioSecaoComponent
  implements OnInit, OnChanges {

  @Input() secao: any;
  secaoApresentacao: any = {};
  public formSecao: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formSecao = this.formBuilder.group({
      id: [null],
    });
  }

  ngOnInit() {
    if (this.secao) {
      this.secaoApresentacao = JSON.parse(this.secao);
    }
  }
  ngOnChanges() {
    this.secaoApresentacao = JSON.parse(this.secao);
  }
}
