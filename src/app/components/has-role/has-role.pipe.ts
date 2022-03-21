import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Pipe({
  name: 'hasRole'
})
export class HasRolePipe implements PipeTransform {
  constructor(private authService: AuthService){  }
  transform(value: any, args?: any): any {
    let valor = this.authService.hasRole(value);
    return valor;
  }

}
