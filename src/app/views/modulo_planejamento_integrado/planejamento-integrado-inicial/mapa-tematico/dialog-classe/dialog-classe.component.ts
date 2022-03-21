import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-classe',
  templateUrl: './dialog-classe.component.html',
  styleUrls: ['./dialog-classe.component.css']
})
export class DialogClasseComponent implements OnInit {

  form: FormGroup;
  cor = null;
  constructor( public dialogRef: MatDialogRef<DialogClasseComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private formBuilder: FormBuilder) {
      if (data) {
        this.form = this.formBuilder.group({
          cor: [data.color, [Validators.required]],
          minimo: [data.minimo, [Validators.required]],
          maximo: [data.maximo, [Validators.required]],
        });
      } else {
        this.form = this.formBuilder.group({
          cor: ['#ffffff', [Validators.required]],
          minimo: [null, [Validators.required]],
          maximo: [null, [Validators.required]],
        });
      }
    }

  ngOnInit() {
  }

  salvar(){
    this.dialogRef.close(this.form.value);
    this.dialogRef.close(this.form.value);
  }
  public _isNaN(value) {
    return isNaN(value);
  }

}
