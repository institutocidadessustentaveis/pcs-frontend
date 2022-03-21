import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Pipe({
  name: 'hasPerfil'
})
export class HasPerfilPipe implements PipeTransform {

  constructor(private authService: AuthService){  }
  transform(value: any, args?: any): any {
    const valor = this.authService.hasPerfil(value);
    return valor;
  }

}
