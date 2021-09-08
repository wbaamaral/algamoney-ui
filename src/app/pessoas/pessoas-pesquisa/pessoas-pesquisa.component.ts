import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, MessageService, ConfirmationService  } from 'primeng/api';
import { Table } from 'primeng/table';

import { PessoaService, PessoaFiltro } from '../pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisa implements OnInit  {

  totalRegistros = 0
  filtro = new PessoaFiltro();
  pessoas = [];

  @ViewChild('tabelaPessoas') grid: Table;
  constructor(
      private pessoaService: PessoaService,
      private messageService: MessageService,
      private errorHandler: ErrorHandlerService,
      private confirmation: ConfirmationService
      ) { }

  ngOnInit() {}

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(pessoa:any){
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        this.grid.reset();
        this.messageService.add({ severity: 'sucess',  summary: 'Exclusão', detail: 'Lançamento excluído com sucesso!'});
      }
      )
      .catch(erro => this.errorHandler.handle(erro));
  }

}
