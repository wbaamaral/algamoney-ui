import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Lancamento } from './../../core/model';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { LancamentoService } from './../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css'],
})
export class LancamentoCadastroComponent implements OnInit {
  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();
  codigo: any;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.codigo = this.route.snapshot.params['codigo'];

    if (this.codigo) {
      console.log(this.route.snapshot.params['codigo']);

      this.carregarLancamento(this.codigo);
    }

    this.carregarCategorias();
    this.carregarPessaos();
  }

  get onEdit() {
    return Boolean(this.codigo);
  }

  carregarLancamento(codigo: number) {
    return this.lancamentoService
      .buscarPorcodigo(codigo)
      .then((lancamento) => {
        this.lancamento = lancamento;
      })
      .catch((error) => this.errorHandler.handle(error));
  }

  carregarCategorias() {
    return this.categoriaService
      .listarTodas()
      .then((categorias) => {
        this.categorias = categorias.map((c) => ({
          label: c.nome,
          value: c.codigo,
        }));
      })
      .catch((error) => this.errorHandler.handle(error));
  }

  carregarPessaos() {
    return this.pessoaService
      .listarTodas(this.onEdit)
      .then((pessoas) => {
        this.pessoas = pessoas.map((p) => ({ label: p.nome, value: p.codigo }));
      })
      .catch((error) => this.errorHandler.handle(error));
  }

  salvar(form: FormControl) {
    this.onEdit ? this.salvarEdicao(form) : this.salvarNovo(form);
  }

  salvarEdicao(form: FormControl) {
    this.lancamentoService
      .atualizar(this.lancamento)
      .then((lancamento) => {
        this.lancamento = lancamento;

        this.messageService.add({
          severity: 'sucess',
          summary: 'Edição',
          detail: 'Lançamento atualizado com sucesso!',
        });

        this.router.navigate(['/lancamentos']);
      })
      .catch((error) => this.errorHandler.handle(error));
  }

  salvarNovo(form: FormControl) {
    this.lancamentoService
      .adicionar(this.lancamento)
      .then((lancamentoNovo) => {
        this.messageService.add({
          severity: 'sucess',
          summary: 'Inclusão',
          detail: 'Lançamento incluído com sucesso!',
        });

        this.router.navigate(['/lancamentos', lancamentoNovo.codigo]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  novoLancamento(form: FormControl) {
    form.reset();

    setTimeout(
      function () {
        this.lancamento = new Lancamento();
      }.bind(this),
      1
    );

    this.router.navigate(['/lancamentos/novo']);
  }
}
