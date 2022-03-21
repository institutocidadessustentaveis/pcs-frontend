import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler):

  Observable<HttpEvent<any>> {
    let token = this.authService.token;

    if (token != null && !(req.url.includes("servicodados.ibge.gov.br")) && !(req.url.includes("http://dontpad.com/pcs-iacit/seo-teste")) && !(req.url.includes("oauth/token"))){
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      this.authService.registrarRequisicaoUsuario();

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
