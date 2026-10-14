import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convocatoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaApertura: string;
  fechaCierre: string;
  cuposDisponibles: number;
  tipoBeca?: { id: number; nombre: string };
  estadoConvocatoria?: { id: number; nombre: string };
}

export interface ConvocatoriaForm {
  nombre: string;
  descripcion?: string;
  fechaApertura: string;
  fechaCierre: string;
  cuposDisponibles?: number;
  tipoBecaId: number;
  estadoConvocatoriaId: number;
}

@Injectable({ providedIn: 'root' })
export class ConvocatoriasService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/convocatorias';

  listar(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(this.url);
  }

  crear(datos: ConvocatoriaForm): Observable<Convocatoria> {
    return this.http.post<Convocatoria>(this.url, datos);
  }

  actualizar(id: number, datos: Partial<ConvocatoriaForm>): Observable<Convocatoria> {
    return this.http.patch<Convocatoria>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}