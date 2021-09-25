import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { IPessoa } from './../../core/interfaces';
import { PessoaService } from '../pessoa.service';
import { Pessoa } from './../../core/model';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css'],
})
export class PessoaCadastroComponent implements OnInit {
  pessoa: IPessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Inclusão de Pessoa');
    const codigoPessoa = this.route.snapshot.params['codigo'];

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
      this.atualizarTituloEdicao();
    }
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  salvar(pessoasForm: NgForm) {
    this.pessoaService.adicionar(this.pessoa).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        pessoasForm.reset();
        this.pessoa = new Pessoa();
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo).subscribe(
      (pessoaEncontrada) => {
        this.pessoa = pessoaEncontrada;
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

  atualizarPessoa(pessoaForm: NgForm) {
    this.pessoaService.adicionar(this.pessoa).subscribe(
      (pessoa) => {
        this.pessoa = pessoa;

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa alterada com sucesso!',
        });
        this.atualizarTituloEdicao();
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  novaPessoa(form: NgForm) {
    form.reset(new Pessoa());

    this.router.navigate(['/pessoas/nova']);
  }
}
