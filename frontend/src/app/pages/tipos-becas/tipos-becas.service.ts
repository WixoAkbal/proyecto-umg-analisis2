import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoBeca {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface TipoBecaForm {
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class TiposBecasService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/tipos-becas';

  listar(): Observable<TipoBeca[]> {
    return this.http.get<TipoBeca[]>(this.url);
  }

  crear(datos: TipoBecaForm): Observable<TipoBeca> {
    return this.http.post<TipoBeca>(this.url, datos);
  }

  actualizar(id: number, datos: Partial<TipoBecaForm>): Observable<TipoBeca> {
    return this.http.patch<TipoBeca>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}