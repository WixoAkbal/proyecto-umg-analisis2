import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evaluacion {
  id: number;
  puntaje: number | string;
  observaciones: string | null;
  solicitud?: { id: number };
  comite?: { id: number; nombre?: string };
}

export interface EvaluacionForm {
  solicitudId: number;
  comiteId: number;
  puntaje: number;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class EvaluacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/evaluaciones';

  listar(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.url);
  }

  crear(datos: EvaluacionForm): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.url, datos);
  }

  actualizar(id: number, datos: Partial<EvaluacionForm>): Observable<Evaluacion> {
    return this.http.patch<Evaluacion>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}