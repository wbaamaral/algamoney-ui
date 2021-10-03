import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private erroHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha).subscribe(
      (response: any) => {
        console.log(response);
        this.auth.armazenarToken(response.access_token);
        this.router.navigate(['lancamentos']);
      },
      (response: any) => {
        console.log(response);
        let erro = response

        if (response.status === 400){
          if (response.error.error === 'invalid_grant'){
            erro = 'Usuário ou Senha Inválido'
          }
        }
        this.erroHandler.handle(erro);
      }
    );
  }
}
