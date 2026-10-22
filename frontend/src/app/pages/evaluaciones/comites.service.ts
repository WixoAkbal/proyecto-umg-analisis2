import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comite {
  id: number;
  nombre: string;
}

export interface Evaluador {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
}

export interface MiembroComite {
  comiteId: number;
  evaluadorId: number;
  evaluador?: Evaluador;
}

@Injectable({ providedIn: 'root' })
export class ComitesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/comites';
  private readonly urlMiembros = 'http://localhost:3000/comites-miembros';

  listar(): Observable<Comite[]> {
    return this.http.get<Comite[]>(this.url);
  }

  crear(nombre: string): Observable<Comite> {
    return this.http.post<Comite>(this.url, { nombre });
  }

  actualizar(id: number, nombre: string): Observable<Comite> {
    return this.http.patch<Comite>(`${this.url}/${id}`, { nombre });
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }

  listarMiembros(): Observable<MiembroComite[]> {
    return this.http.get<MiembroComite[]>(this.urlMiembros);
  }

  listarEvaluadores(): Observable<Evaluador[]> {
    return this.http.get<Evaluador[]>(`${this.urlMiembros}/evaluadores`);
  }

  agregarMiembro(comiteId: number, evaluadorId: number): Observable<unknown> {
    return this.http.post(this.urlMiembros, { comiteId, evaluadorId });
  }

  quitarMiembro(comiteId: number, evaluadorId: number): Observable<unknown> {
    return this.http.delete(`${this.urlMiembros}/${comiteId}/${evaluadorId}`);
  }
}