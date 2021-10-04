import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nao-autorizado',
  template: `
    <div class="container">
      <h1 class="text-center">Acesso Negado!</h1>
      <div></div>
    </div>
  `,
  styles: [],
})
export class NaoAutorizadoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
