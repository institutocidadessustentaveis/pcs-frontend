
export class AlterarSenhaService {
  static confirmarSenha(passwordKey: any) {
    let passwordInput = passwordKey['value'];
    if (passwordInput.Password === passwordInput.ConfirmPassword) {
      return null;
    }
    else {
      return passwordKey.controls['ConfirmPassword'].setErrors({ passwordNotEquivalent: true });
    }
  }
}
