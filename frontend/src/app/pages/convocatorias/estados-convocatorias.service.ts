import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstadoConvocatoria {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class EstadosConvocatoriasService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/estados-convocatorias';

  listar(): Observable<EstadoConvocatoria[]> {
    return this.http.get<EstadoConvocatoria[]>(this.url);
  }
}