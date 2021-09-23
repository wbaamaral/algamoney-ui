import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';

import { Lancamento } from './../core/model';
import { LancamentoFiltro } from './lancamento-filtro';
import { DatePipe } from '@angular/common';

@Injectable()
export class LancamentoService {
  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  private converterStringParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(
        lancamento.dataVencimento,
        'YYYY-MM-DD'
      ).toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(
          lancamento.dataPagamento,
          'YYYY-MM-DD'
        ).toDate();
      }
    }
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set(
        'dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD')
      );
    }

    if (filtro.dataVencimentoFim) {
      params = params.set(
        'dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD')
      );
    }

    return this.http
      .get(`${this.lancamentosUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response) => {
        const lancamentos = response['content'];

        const resultado = {
          lancamentos,
          total: response['totalElements'],
        };

        return resultado;
      });
  }

  buscarPorcodigo(codigo: number): Promise<Lancamento> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return this.http
      .get<Lancamento>(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise()
      .then((response) => {
        const lancamento = response;

        this.converterStringParaDatas([lancamento]);

        return lancamento;
      });
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http
      .post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http
      .put<Lancamento>(
        `${this.lancamentosUrl}/${lancamento.codigo}`,
        lancamento,
        { headers }
      )
      .toPromise()
      .then((response) => {
        const lancamentoModificado = response;

        this.converterStringParaDatas([lancamentoModificado]);

        return lancamentoModificado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return this.http
      .delete(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }
}
