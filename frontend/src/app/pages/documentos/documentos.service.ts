import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Documento {
  id: number;
  nombre: string;
  tipoArchivo: string;
  comentarioRevision?: string | null;
  fechaHoraCreado?: string;
  tipoDocumento?: { id: number; nombre: string };
}

@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/documentos';

  listarPorSolicitud(solicitudId: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.url}/solicitud/${solicitudId}`);
  }

  subir(solicitudId: number, tipoDocumentoId: number, archivo: File): Observable<Documento> {
    const datos = new FormData();
    datos.append('solicitudId', String(solicitudId));
    datos.append('tipoDocumentoId', String(tipoDocumentoId));
    datos.append('archivo', archivo);
    return this.http.post<Documento>(this.url, datos);
  }

  descargar(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/archivo`, { responseType: 'blob' });
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}