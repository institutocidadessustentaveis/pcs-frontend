import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  titulo = 'PCS';
  scrollUp: any;

  constructor(private authService: AuthService, private router: Router, private element: ElementRef,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  logout(): void {
    const username = this.authService.credencial.nome;
    this.authService.logout();
    PcsUtil.swal().fire({
      title: 'Logout',
      text: `Olá, ${username}, sessão finalizada com sucesso!`,
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.router.navigate(['/login']);
    }, error => { });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
