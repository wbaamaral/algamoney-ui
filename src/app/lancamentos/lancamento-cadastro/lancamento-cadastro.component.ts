import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ILancamento, IPessoa } from './../../core/interfaces';
import { Lancamento } from './../../core/model';
import { PessoaService } from './../../pessoas/pessoa.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css'],
})
export class LancamentoCadastroComponent implements OnInit {
  lancamento: ILancamento = new Lancamento();

  categorias: any[] = [];
  pessoas: any[] = [];

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Novo Lançamento');
    const codigoLancamento = this.route.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo).subscribe(
      (lancamento) => {
        this.converterStringsParaDatas([lancamento]);
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas().subscribe(
      (dados) => {
        this.categorias = dados.map((dado) => ({
          label: dado.nome,
          value: dado.codigo,
        }));
      },
      (erro) => {
        this.errorHandler.handle(erro);
      }
    );
  }
  carregarPessoas() {
    this.pessoaService.listarTodas().subscribe(
      (dados) => {
        this.pessoas = dados.content.map((dado: IPessoa) => ({
          label: dado.nome,
          value: dado.codigo,
        }));
      },
      (erro) => {
        this.errorHandler.handle(erro);
      }
    );
  }

  /*carregarPessoas() {
    return this.pessoaService
      .listarTodas()
      .toPromise()
      .then((pessoas: any) => {
        this.pessoas = pessoas.map((pessoa: IComboPessoa) => ({
          label: pessoa.nome,
          value: pessoa.codigo,
        }));
      })
      .catch((error: any) => this.errorHandler.handle(error));

      dados => {
        this.pessoas = dados.content.map((dado: IPessoa) => ({label: dado.nome, value: dado.codigo}))
      },
      erro => {
        this.errorHandler.handle(erro)
      }
    )

  }
*/

  salvar(lancamentoForm: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(lancamentoForm);
      console.log('atualizando');
    } else {
      this.adicionarLancamento(lancamentoForm);
      console.log('adicionando');
    }
  }

  atualizarLancamento(lancamentoForm: NgForm) {
    this.lancamentoService.atualizar(this.lancamento).subscribe(
      (lancamento) => {
        this.lancamento = lancamento;
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento alterado com sucesso!',
        });
        this.atualizarTituloEdicao();
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  adicionarLancamento(lancamentoForm: NgForm) {
    this.lancamentoService.adicionar(this.lancamento).subscribe(
      (lancamentoAdicionado) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  novo(lancamentoForm: NgForm) {
    lancamentoForm.reset(new Lancamento());

    this.router.navigate(['lancamentos/novo']);
  }

  private converterStringsParaDatas(lancamentos: ILancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = new Date(lancamento.dataVencimento);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(lancamento.dataPagamento);
      }
    }
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }
}
