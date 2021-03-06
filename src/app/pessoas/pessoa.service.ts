import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { IApiResponse, IPessoa, IPessoaFiltro } from '../core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) {}

  pesquisar(filtro: IPessoaFiltro): Observable<IApiResponse<IPessoa>> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get<IApiResponse<IPessoa>>(`${this.pessoasUrl}`, {
      params,
    });
  }

  listarTodas(): Observable<IApiResponse<IPessoa>> {
    return this.http.get<IApiResponse<IPessoa>>(`${this.pessoasUrl}`);
  }

  excluir(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.pessoasUrl}/${codigo}`);
  }

  mudarStatus(codigo: number, ativo: boolean): Observable<void> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    return this.http.put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo, {
      headers,
    });
  }

  adicionar(pessoa: IPessoa): Observable<IPessoa> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    return this.http.post<IPessoa>(this.pessoasUrl, pessoa, { headers });
  }

  atualizar(pessoa: IPessoa): Observable<IPessoa> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    return this.http.put<IPessoa>(
      `${this.pessoasUrl}/${pessoa.codigo}`,
      pessoa,
      { headers }
    );
  }

  buscarPorCodigo(codigo: number): Observable<IPessoa> {
    return this.http.get<IPessoa>(`${this.pessoasUrl}/${codigo}`);
  }
}
