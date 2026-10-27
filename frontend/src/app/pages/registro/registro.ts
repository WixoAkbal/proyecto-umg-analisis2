import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PasswordModule } from '@openng/optimus-ui/password';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';
import { NewUserRequest } from '../../shared/requests/new-user.request';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-registro',
	imports: [
		ReactiveFormsModule,
		RouterLink,
		CardModule,
		InputTextModule,
		PasswordModule,
		ButtonModule
	],
	templateUrl: './registro.html'
})
export class Registro implements OnInit {
	
	private readonly _http = inject(HttpClient);

	@ViewChild('formularioRegistroNgForm') formularioRegistroNgForm: NgForm;
	formularioRegistro: UntypedFormGroup;

	newUser: NewUserRequest;

	cargando = false;
	mensajeExito = '';
  	mensajeError = '';

	constructor(
		private readonly _formBuilder: UntypedFormBuilder,
		private readonly _userService: UserService
	) { }
	
	ngOnInit(): void {
		this.initFormularioRegistro();
	}

	initFormularioRegistro(): void {
		this.formularioRegistro = this._formBuilder.group({
			nombre: ['', [Validators.required, Validators.maxLength(100)]],
			apellido: ['', [Validators.required, Validators.maxLength(100)]],
			correo: ['', [Validators.required, Validators.maxLength(150)]],
			contrasenia: ['', [Validators.required]],
			confirmarContrasenia: ['', [Validators.required]]
		});
	}

	async registrar(): Promise<void> {
		this.mensajeExito = '';
	    this.mensajeError = '';

		if (this.formularioRegistro.invalid) {
			this.formularioRegistro.markAllAsTouched();
			return;
		}

		const registro = this.formularioRegistro.getRawValue();
		if (registro.contrasenia !== registro.confirmarContrasenia) {
			this.mensajeError = 'Las contraseñas no coinciden.';
      		return;
		}

		this.newUser = new NewUserRequest();
		this.newUser.nombre = registro.nombre.trim();
		this.newUser.apellido = registro.apellido.trim();
		this.newUser.correoElectronico = registro.correo.trim();
		this.newUser.contrasenia = registro.contrasenia.trim();
		this.newUser.rolId = 3;
		this.newUser.estadoId = 1;

		await this._userService.registerUser(this.newUser);
	}
}
