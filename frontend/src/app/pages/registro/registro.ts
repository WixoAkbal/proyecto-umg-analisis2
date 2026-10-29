import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PasswordModule } from '@openng/optimus-ui/password';
import { SelectModule } from '@openng/optimus-ui/select';
import { Dropdown } from '../../shared/models/dropdown.model';
import { NewUserRequest } from '../../shared/requests/new-user.request';
import { DropdownServices } from '../../shared/services/dropdown.service';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-registro',
	imports: [
		ReactiveFormsModule,
		RouterLink,
		CardModule,
		InputTextModule,
		PasswordModule,
		ButtonModule,
		SelectModule,
		DatePickerModule,
		InputMaskModule
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
	fechaMaxima = new Date();

	ddNivelAcademico: Array<Dropdown> = [];
	ddGenero: Array<Dropdown> = [
		{ value: 'Masculino', description: 'Masculino' },
		{ value: 'Femenino', description: 'Femenino' }
	];

	constructor(
		private readonly _formBuilder: UntypedFormBuilder,
		private readonly _userService: UserService,
		private readonly _dropdownService: DropdownServices
	) { }
	
	ngOnInit(): void {
		this.initDropdowns();
		this.initFormularioRegistro();
	}

	initFormularioRegistro(): void {
		this.formularioRegistro = this._formBuilder.group({
			nombre: ['', [Validators.required, Validators.maxLength(100)]],
			apellido: ['', [Validators.required, Validators.maxLength(100)]],
			correo: ['', [Validators.required, Validators.maxLength(150)]],
			contrasenia: ['', [Validators.required]],
			confirmarContrasenia: ['', [Validators.required]],
			nivelAcademico: ['', [Validators.required]],
			institucionEducativa: ['', [Validators.required, Validators.maxLength(200)]],
			genero: ['', [Validators.required]],
			fechaNacimiento: ['', [Validators.required]],

		});
	}

	async initDropdowns() {
		this.ddNivelAcademico = await this._dropdownService.getNivelesAcademicos();
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

		const fecha = this.formularioRegistro.get('fechaNacimiento')?.value;
		const fechaFormateada = fecha instanceof Date? [
			fecha.getFullYear(),
			String(fecha.getMonth() + 1).padStart(2, '0'),
			String(fecha.getDate()).padStart(2, '0'),
			].join('-')
		: fecha;

		this.newUser = new NewUserRequest();
		this.newUser.nombre = registro.nombre.trim();
		this.newUser.apellido = registro.apellido.trim();
		this.newUser.correoElectronico = registro.correo.trim();
		this.newUser.contrasenia = registro.contrasenia.trim();
		this.newUser.rolId = 3;
		this.newUser.estadoId = 1;
		this.newUser.nivelAcademico = registro.nivelAcademico;
		this.newUser.institucionEducativa = registro.institucionEducativa;
		this.newUser.genero = registro.genero
		this.newUser.fechaNacimiento = fechaFormateada;

		await this._userService.registerUser(this.newUser);
	}
}
