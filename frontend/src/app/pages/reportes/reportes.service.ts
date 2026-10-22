import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumenPorEstado {
  estadoId: number;
  estado: string;
  total: number;
}

export interface ResumenPorConvocatoria {
  convocatoriaId: number;
  convocatoria: string;
  total: number;
  porEstado: Record<number, number>;
}

export interface Resumen {
  total: number;
  porEstado: ResumenPorEstado[];
  porConvocatoria: ResumenPorConvocatoria[];
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/solicitudes/resumen';

  resumen(): Observable<Resumen> {
    return this.http.get<Resumen>(this.url);
  }
}