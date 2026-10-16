import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstadoSolicitud {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class EstadosSolicitudesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/estados-solicitudes';

  listar(): Observable<EstadoSolicitud[]> {
    return this.http.get<EstadoSolicitud[]>(this.url);
  }
}