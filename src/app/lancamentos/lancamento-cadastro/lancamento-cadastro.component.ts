import { MessageService } from 'primeng/api';

import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Lancamento } from './../../core/model';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { LancamentoService } from './../lancamento.service';
@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.carregarCategorias();
    this.carregarPessaos();
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then( categorias => {
        this.categorias = categorias.map( c => ({ label: c.nome, value: c.codigo }));
      })
  .catch( error => this.errorHandler.handle(error));
  }

  carregarPessaos() {
    return this.pessoaService.listarTodas()
      .then( pessoas =>{
        this.pessoas = pessoas.map( p => ({label: p.nome, value: p.codigo}));
      }
      )
      .catch( error => this.errorHandler.handle(error));
  }

  salvar(form: FormControl){
    this.lancamentoService.adicionar(this.lancamento)
    .then(() => {
      this.messageService.add({ severity: 'sucess',  summary: 'Inclusão', detail: 'Lançamento incluído com sucesso!'});

      form.reset();
      this.lancamento = new Lancamento();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }
}
