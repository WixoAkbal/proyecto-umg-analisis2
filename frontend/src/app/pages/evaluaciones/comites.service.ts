import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comite {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class ComitesService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/comites';

  listar(): Observable<Comite[]> {
    return this.http.get<Comite[]>(this.url);
  }
}