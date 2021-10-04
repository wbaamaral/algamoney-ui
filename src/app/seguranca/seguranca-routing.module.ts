import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SegurancaRoutingModule {}
