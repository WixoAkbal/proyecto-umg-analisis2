import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  leida: boolean;
  fechaHoraCreado?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/notificaciones';

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url);
  }

  marcarLeida(id: number): Observable<unknown> {
    return this.http.patch(`${this.url}/${id}/leida`, {});
  }
}