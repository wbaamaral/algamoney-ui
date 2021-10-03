import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  exibindoMenu: boolean = false;
  usuarioLogado: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.usuarioLogado = this.auth.jwtPayload?.nome;
  }

  permiteAcesso(permissao: string) {
    return this.auth.temPermissao(permissao);
  }
}
