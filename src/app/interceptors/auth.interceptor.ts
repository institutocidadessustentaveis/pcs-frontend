import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import swal from 'sweetalert2';
import {catchError} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):

  Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {

        if (e.status ==401){
          if (this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }

        if (e.status == 403){
          swal.fire('Acesso negado', 'Você não possui acesso a este recurso!', 'warning');
          this.router.navigate(['/institucional']);
        }

        return throwError(e);
      })
    );
  }
}
