import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistorialEstado {
  id: number;
  comentario: string | null;
  fechaHoraCreado: string;
  estadoAnteriorSolicitud?: { nombre: string } | null;
  estadoNuevoSolicitud?: { nombre: string };
  usuario?: { nombre: string; apellido: string };
}

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/historial-estados';

  listarPorSolicitud(solicitudId: number): Observable<HistorialEstado[]> {
    return this.http.get<HistorialEstado[]>(`${this.url}/solicitud/${solicitudId}`);
  }
}