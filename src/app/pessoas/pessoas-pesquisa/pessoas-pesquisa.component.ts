import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { IPessoa, IPessoaFiltro } from './../../core/interfaces';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css'],
})
export class PessoasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro: IPessoaFiltro = {
    pagina: 0,
    itensPorPagina: 5,
  };
  pessoas: IPessoa[] = [];
  @ViewChild('tabela') grid: any;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro).subscribe(
      (dados) => {
        this.pessoas = dados.content;
        this.totalRegistros = dados.totalElements;
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: IPessoa): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      },
    });
  }

  excluir(pessoa: IPessoa) {
    this.pessoaService.excluir(pessoa.codigo).subscribe(
      () => {
        this.grid.reset();

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa excluída com sucesso!',
        });
      },
      (error) => this.errorHandler.handle(error)
    );
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus).subscribe(
      () => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({
          severity: 'success',
          detail: `Pessoa ${acao} com sucesso!`,
        });
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }
}
