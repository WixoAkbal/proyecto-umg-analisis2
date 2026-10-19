
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

function obtenerMensaje(error: HttpErrorResponse): string {
	if (error.status === 0) {
		return 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.';
	}

	const respuesta = error.error;

	if (typeof respuesta?.message === 'string') {
		return respuesta.message;
	}

	if (Array.isArray(respuesta?.message)) {
		return respuesta.message.join('\n');
	}

	switch (error.status) {
		case 400:
			return 'La solicitud contiene datos incorrectos.';
		case 401:
			return 'Tu sesión no está autenticada o ha expirado.';
		case 403:
			return 'No tienes permisos para realizar esta acción.';
		case 404:
			return 'No se encontró el recurso solicitado.';
		case 409:
			return 'La solicitud presenta un conflicto con los datos existentes.';
		case 422:
			return 'No fue posible procesar los datos enviados.';
		case 429:
			return 'Has realizado demasiadas solicitudes. Inténtalo más tarde.';
		case 500:
			return 'Ocurrió un error interno en el servidor.';
		case 502:
		case 503:
		case 504:
			return 'El servicio no está disponible en este momento.';
		default:
			return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
	}
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		catchError((error: unknown) => {
			if (error instanceof HttpErrorResponse) {
				const mensaje = obtenerMensaje(error);

				void Swal.fire({
					icon: 'error',
					title: '¡Ups! Algo salió mal',
					text: mensaje,
					confirmButtonText: 'Entendido',
					confirmButtonColor: '#7969f2',
					background: '#ffffff',
					color: '#242344',
					allowOutsideClick: false,
				});
			}

			return throwError(() => error);
		}),
	);
};
