import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import * as Fingerprint2 from 'fingerprintjs2';
import { Router } from '@angular/router';
import { PcsUtil } from './pcs-util.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketEchoService {

  WEB_SOCKET_URL: string = `${environment.API_URL}stomp`;

  stompClient;

  browserFingerprint: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

  }

  public startWebSocket() {
    let that = this;

    if(this.authService.isAuthenticated()) {
      Fingerprint2.get({excludes: {fonts: true, adBlock: true, canvas: true, webgl: true, plugins: true, enumerateDevices: true, audio:true}}, (components) => {
        that.browserFingerprint = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31)
      })

      let socket = new SockJS(`${this.WEB_SOCKET_URL}?access_token=${this.authService.token}`);
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = null

      this.stompClient.connect({}, (frame) => {
        that.stompClient.send("/app/echo", {}, that.browserFingerprint);

        that.stompClient.subscribe("/user/queue/errors", (message) => {
        })

        that.stompClient.subscribe("/user/queue/echo", (message) => {
          if(message.body === "ok") {
            setTimeout(() => {
              that.stompClient.send("/app/echo", {}, that.browserFingerprint);
            }, 5000);
          }

          if(message.body === "logout") {
            that.stompClient.disconnect();
            this.authService.logout();

            PcsUtil.swal().fire({
              title: 'Sessão finalizada',
              text: 'No momento a conta está sendo usada em outro dispositivo',
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            }).then((result) => {
              this.router.navigate(['/']);
            }, error => { });
          }
        })
      }, (message) => {
      });
    }
  }

  public stopWebSocket() {
    if(this.stompClient != undefined) {
      this.stompClient.disconnect();
    }
  }

}
