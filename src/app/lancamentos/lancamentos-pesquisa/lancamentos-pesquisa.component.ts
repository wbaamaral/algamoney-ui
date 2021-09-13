import { Component, OnInit, ViewChild } from '@angular/core';

import { Table } from 'primeng/table';
import {
  LazyLoadEvent,
  MessageService,
  ConfirmationService,
} from 'primeng/api';

import { LancamentoService } from './../lancamento.service';
import { LancamentoFiltro } from './../lancamento-filtro';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
})
export class LancamentosPesquisaComponent implements OnInit {
  totalRegistros = 0;
  lancamentos = [];
  filtro = new LancamentoFiltro();

  @ViewChild('tabela') grid: Table;

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit() {}

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService
      .pesquisar(this.filtro)
      .then((resultado) => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      },
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService
      .excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();
        this.messageService.add({
          severity: 'sucess',
          summary: 'Exclusão',
          detail: 'Lançamento excluído com sucesso!',
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
