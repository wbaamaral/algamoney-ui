import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { IPessoa, ILancamento } from './../../core/interfaces';
import { Lancamento } from './../../core/model';
import { LancamentoService } from '../lancamento.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    this.title.setTitle('Novo Lancamento');
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
        if (this.editando) {
          this.atualizarTitulo(
            'Editando Lançamento',
            this.lancamento.descricao
          );
        }
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
    return this.pessoaService
      .listarCombo()
      .then((pessoas) => {
        this.pessoas = pessoas.map( (pessoa: any) => ({label: pessoa.nome, value: pessoa.codigo}));
      })
      .catch((error) => this.errorHandler.handle(error));
  }

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
        this.atualizarTitulo('Editando Lançamento', this.lancamento.descricao);
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
        this.atualizarTitulo('Novo Lançamento', '***');

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

  private atualizarTitulo(acao: string, descricao: string) {
    this.title.setTitle(`${acao}: ${descricao}`);
  }
}
