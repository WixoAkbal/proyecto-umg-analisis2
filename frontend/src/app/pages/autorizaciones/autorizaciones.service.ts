import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Autorizacion {
  id: number;
  monto: number;
  requiereConfirmacion: boolean;
  estadoAutorizacion: 'AUTORIZADA' | 'PENDIENTE_CONFIRMACION';
  fechaAutorizacion: string;
  fechaConfirmacion: string | null;
  comentario: string | null;
  solicitud?: { id: number };
  autorizadoPor?: { nombre: string; apellido: string };
  confirmadoPor?: { nombre: string; apellido: string } | null;
}

export interface SolicitudResumen {
  id: number;
  persona?: { primerNombre?: string; primerApellido?: string };
  convocatoria?: { nombre?: string };
}

export interface NuevaAutorizacion {
  solicitudId: number;
  monto: number;
  comentario?: string;
}

@Injectable({ providedIn: 'root' })
export class AutorizacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/autorizaciones';
  private readonly urlSolicitudes = 'http://localhost:3000/solicitudes';

  listar(): Observable<Autorizacion[]> {
    return this.http.get<Autorizacion[]>(this.url);
  }

  listarSolicitudes(): Observable<SolicitudResumen[]> {
    return this.http.get<SolicitudResumen[]>(this.urlSolicitudes);
  }

  crear(datos: NuevaAutorizacion): Observable<Autorizacion> {
    return this.http.post<Autorizacion>(this.url, datos);
  }

  confirmar(id: number): Observable<Autorizacion> {
    return this.http.patch<Autorizacion>(`${this.url}/${id}/confirmar`, {});
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}