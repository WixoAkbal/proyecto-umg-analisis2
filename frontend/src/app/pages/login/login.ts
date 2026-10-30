import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PasswordModule } from '@openng/optimus-ui/password';
import { AuthService } from '../../core/auth.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
	selector: 'app-login',
	imports: [
		FormsModule, 
		ButtonModule, 
		CardModule, 
		InputTextModule, 
		PasswordModule,
		RouterLink
	],
	templateUrl: './login.html'
})
export class Login {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	username = '';
	password = '';
	cargando = signal(false);
	error = signal('');

	iniciarSesion(): void {
		this.error.set('');
		this.cargando.set(true);

		this.authService.login(this.username, this.password).subscribe({
			next: () => {
				this.cargando.set(false);
				this.showSweetAlert('success', "¡Bienvenido!");
				this.router.navigate(['/tipos-becas']);
			},
			error: (err: HttpErrorResponse) => {
				this.cargando.set(false);
				this.showSweetAlert('error', err.error.message);
			},
		});
	}

	private showSweetAlert(iconType: SweetAlertIcon, messageEvent: string): void {
		void Swal.fire({
			icon: iconType,
			text: messageEvent,
			confirmButtonText: 'Entendido',
			confirmButtonColor: '#7969f2',
			background: '#ffffff',
			color: '#242344',
			allowOutsideClick: false,
		});
	}
}