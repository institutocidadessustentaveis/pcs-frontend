import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShapeFileService } from 'src/app/services/shapefile.service';

@Component({
  selector: 'app-criar-legenda',
  templateUrl: './criar-legenda.component.html',
  styleUrls: ['./criar-legenda.component.css']
})
export class CriarLegendaComponent implements OnInit {

  colorHasClickedLegenda = false;
  colorHasClickedCamada = false;

  public menuCamadas: any[] = []

  constructor(
    public dialogRef: MatDialogRef<CriarLegendaComponent>,
    private shapeFileService: ShapeFileService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() {
    this.gerarMenuShapes()
  }

  public gerarMenuShapes() {    
    this.shapeFileService.buscarShapesListagemMapa().subscribe((res) => {
      let camadas: any[] = res;
      camadas.forEach(camada => this.menuCamadas.push(camada.nome))      
    });
  }

  public adicionarAtributo() {
    this.data.listaGrades.push('');
    this.data.listaLabels.push('');
  }

  public removerAtributo(index: number) {
    this.data.listaGrades.splice(index, 1);
    this.data.listaLabels.splice(index, 1);
  }

  public adicionarAtributoCamadaComLegenda() {
    this.data.camadasComLegenda.push({})
  }

  public removerAtributoCamadaComLegenda(index: number) {
    this.data.camadasComLegenda.splice(index, 1);

  }

  public salvar() {
      this.dialogRef.close(this.data);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

  colorClick(input: string) {
    if(input == 'legenda') {
      this.colorHasClickedLegenda = true;
    } 

    if(input == 'camada') {
      this.colorHasClickedCamada = true;
    }
    
  }
}
