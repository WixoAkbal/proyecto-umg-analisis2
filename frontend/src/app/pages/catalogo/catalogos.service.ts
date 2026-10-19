import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemCatalogo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface ItemCatalogoForm {
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:3000';

  listar(endpoint: string): Observable<ItemCatalogo[]> {
    return this.http.get<ItemCatalogo[]>(`${this.base}/${endpoint}`);
  }

  crear(endpoint: string, datos: ItemCatalogoForm): Observable<ItemCatalogo> {
    return this.http.post<ItemCatalogo>(`${this.base}/${endpoint}`, datos);
  }

  actualizar(endpoint: string, id: number, datos: ItemCatalogoForm): Observable<ItemCatalogo> {
    return this.http.patch<ItemCatalogo>(`${this.base}/${endpoint}/${id}`, datos);
  }

  eliminar(endpoint: string, id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${endpoint}/${id}`);
  }
}