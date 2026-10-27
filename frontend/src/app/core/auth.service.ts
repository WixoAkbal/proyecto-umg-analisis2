import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
	token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly apiUrl = 'http://localhost:3000';
	private readonly claveToken = 'token';
	
	private _authenticated: boolean = false;
	
	set accessToken(token: string) {
		localStorage.setItem('accessToken', token);
	}

	get accessToken(): string {
		return localStorage.getItem('accessToken') ?? '';
	}

	login(username: string, password: string): Observable<any> {
		return this.http.post(`${environment.API_URL}/auth/login`, { username, password }).pipe(
			tap((response: any) => {
				this.guardarToken(response.token);
				this._authenticated = true;

				return (response);
			})
		);
	}

	login2(username: string, password: string): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
			.pipe(tap((respuesta) => this.guardarToken(respuesta.token)));
	}

	logout(): void {
		if (this.esNavegador) {
			localStorage.removeItem(this.claveToken);
		}
	}

	getToken(): string | null {
		return this.esNavegador ? localStorage.getItem(this.claveToken) : null;
	}

	estaAutenticado(): boolean {
		return this.getToken() !== null;
	}

	getRoles(): string[] {
		const token = this.getToken();
		if (!token) return [];
		try {
			const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
			return JSON.parse(atob(base64)).roles ?? [];
		} catch {
			return [];
		}
	}

	esAdmin(): boolean {
		return this.getRoles().some((rol) => rol.toUpperCase() === 'ADMIN');
	}

	tieneRol(...roles: string[]): boolean {
		const mios = this.getRoles().map((rol) => rol.toUpperCase());
		return roles.some((rol) => mios.includes(rol.toUpperCase()));
	}

	private guardarToken(token: string): void {
		if (this.esNavegador) {
			localStorage.setItem(this.claveToken, token);
		}
	}
}