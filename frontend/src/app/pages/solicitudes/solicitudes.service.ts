import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Solicitud {
  id: number;
  persona?: { id: number; primerNombre?: string; primerApellido?: string };
  convocatoria?: { id: number; nombre: string };
  estadoSolicitud?: { id: number; nombre: string };
}

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/solicitudes';

  listar(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.url);
  }

  cambiarEstado(id: number, estadoSolicitudId: number): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`${this.url}/${id}`, { estadoSolicitudId });
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }

  mias(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.url}/mias`);
  }

  crearPropia(convocatoriaId: number): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.url}/propia`, { convocatoriaId });
  }

  cancelar(id: number): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`${this.url}/${id}/cancelar`, {});
  }
}