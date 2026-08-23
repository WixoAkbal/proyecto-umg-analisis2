drop database proyecto_umg_analisis2_db;

create database proyecto_umg_analisis2_db;

set @@session.time_zone = 'America/Guatemala';

commit;

use proyecto_umg_analisis2_db;


create table estados_registro (
	id int auto_increment primary key,
	nombre varchar(50) not null unique,
	descripcion varchar(200),
	creado_por int not null,
	fecha_hora_creado datetime not null default current_timestamp,
	modificado_por int,
	fecha_hora_modificado datetime on update current_timestamp,
	estado boolean not null default true
);

insert into estados_registro (nombre, descripcion, creado_por) values
('Activo', 'Registro activo y en uso normal', 1),
('Inactivo', 'Registro desactivado temporalmente', 1),
('Eliminado', 'Registro eliminado logicamente, se conserva para trazabilidad', 1);

select * from estados_registro;

create table usuarios (
	id int auto_increment primary key,
	nombre varchar(100) not null,
	apellido varchar(100) not null,
	correo_electronico varchar(150) not null unique,
	contrasenia varchar(250) not null,
	creado_por int not null,
	fecha_hora_creado datetime not null default current_timestamp,
	modificado_por int,
	fecha_hora_modificado datetime on update current_timestamp,
	estado_id int not null,
	estado_anterior_id int,
	foreign key (creado_por) references usuarios(id),
	foreign key (modificado_por) references usuarios(id),
	foreign key (estado_id) references estados_registro(id),
	foreign key (estado_anterior_id) references estados_registro(id)
);

insert into usuarios (nombre, apellido, correo_electronico, contrasenia, creado_por, estado_id) values
('Admin', 'Admin', 'admin@email.com', 'admin123', 1, 1);

select * from usuarios;

create table roles (
	id int auto_increment primary key,
	nombre varchar(50) not null unique,
	descripcion varchar(200),
	creado_por int not null,
	fecha_hora_creado datetime not null default current_timestamp,
	modificado_por int null,
	fecha_hora_modificado datetime null on update current_timestamp,
	estado boolean not null default true
);

insert into roles (nombre, descripcion, creado_por) values
('ADMIN', 'Usuario administrador del sistema', 1),
('EVALUADOR', 'Usuario que evalua solicitudes', 1),
('ESTUDIANTE', 'Usuario que aplica a becas', 1);

select * from roles r;

create table usuarios_roles (
	usuario_id int not null,
	rol_id int not null,
	creado_por int null,
	fecha_hora_creado datetime not null default current_timestamp,
	modificado_por int null,
	fecha_hora_modificado datetime null on update current_timestamp,
	estado_id int not null,
	estado_anterior_id int,
	primary key (usuario_id, rol_id),
	foreign key (usuario_id) references usuarios(id),
	foreign key (rol_id) references roles(id),
	foreign key (creado_por) references usuarios(id),
	foreign key (modificado_por) references usuarios(id),
	foreign key (estado_id) references estados_registro(id),
	foreign key (estado_anterior_id) references estados_registro(id)
);

insert into usuarios_roles (usuario_id, rol_id, creado_por, estado_id) values
(1, 1, 1, 1);

select * from usuarios_roles;

create table niveles_academicos (
id int auto_increment primary key,
nombre varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table estados_convocatorias (
id int auto_increment primary key,
nombre varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table estados_solicitudes (
id int auto_increment primary key,
nombre varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table estados_documentos (
id int auto_increment primary key,
nombre varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table tipos_becas (
id int auto_increment primary key,
nombre varchar(100) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table tipos_documentos (
id int auto_increment primary key,
nombre varchar(100) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table servicios (
id int auto_increment primary key,
nombre varchar(100) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true
);

create table recursos (
id int auto_increment primary key,
nombre varchar(100) not null,
ruta varchar(200),
icono varchar(100),
descripcion varchar(200),
padre_id int null,
servicio_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado boolean not null default true,
foreign key (padre_id) references recursos(id) on delete set null,
foreign key (servicio_id) references servicios(id) on delete restrict
);


create table permisos (
id int auto_increment primary key,
nombre varchar(100),
descripcion varchar(200),
rol_id int not null,
ejecutar boolean not null default false,
seleccionar boolean not null default false,
insertar boolean not null default false,
modificar boolean not null default false,
eliminar boolean not null default false,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (rol_id) references roles(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null
);

create table personas (
id int auto_increment primary key,
primer_nombre varchar(100) not null,
segundo_nombre varchar(100), 
tercer_nombre varchar(100),
primer_apellido varchar(100) not null,
segundo_apellido varchar(100),
apellido_casada varchar(100),
dpi varchar(20) not null unique,
nivel_academico_id int not null,
institucion_educativa varchar(200) not null,
telefono varchar(20),
direccion varchar(255),
genero enum('masculino', 'femenino') not null,
fecha_nacimiento date not null,
usuario_id int not null unique,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (nivel_academico_id) references niveles_academicos(id) on delete restrict,
foreign key (usuario_id) references usuarios(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null
);

create table convocatorias (
id int auto_increment primary key,
nombre varchar(200) not null,
tipo_beca_id int not null,
descripcion text,
fecha_apertura date not null,
fecha_cierre date not null,
cupos_disponibles int not null default 0,
estado_convocatoria_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (tipo_beca_id) references tipos_becas(id) on delete restrict,
foreign key (estado_convocatoria_id) references estados_convocatorias(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null
);

create table comites (
id int auto_increment primary key,
nombre varchar(150) not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null
);

create table comites_miembros (
comite_id int not null,
evaluador_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
primary key (comite_id, evaluador_id),
foreign key (comite_id) references comites(id) on delete cascade,
foreign key (evaluador_id) references usuarios(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null
);

create table solicitudes (
id int auto_increment primary key,
persona_id int not null,
convocatoria_id int not null,
comite_id int null,
estado_solicitud_id int not null,
estado_revision_documentos_id int null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (persona_id) references personas(id) on delete cascade,
foreign key (convocatoria_id) references convocatorias(id) on delete restrict,
foreign key (comite_id) references comites(id) on delete set null,
foreign key (estado_solicitud_id) references estados_solicitudes(id) on delete restrict,
foreign key (estado_revision_documentos_id) references estados_documentos(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null,
index idx_solicitudes_persona (persona_id),
index idx_solicitudes_convocatoria (convocatoria_id),
index idx_solicitudes_estado (estado_solicitud_id)
);

create table documentos (
id int auto_increment primary key,
solicitud_id int not null,
tipo_documento_id int not null,
nombre varchar(255) not null,
tipo_archivo varchar(20) not null,
archivo longblob not null,
comentario_revision varchar(500),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (tipo_documento_id) references tipos_documentos(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null,
index idx_documentos_solicitud (solicitud_id)
);

create table evaluaciones (
id int auto_increment primary key,
solicitud_id int not null,
comite_id int not null,
puntaje decimal(5,2) not null,
observaciones text,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (comite_id) references comites(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null,
index idx_evaluaciones_solicitud (solicitud_id)
);

create table historial_estados (
id int auto_increment primary key,
solicitud_id int not null,
estado_anterior_solicitud_id int null,
estado_nuevo_solicitud_id int not null,
usuario_id int not null,
comentario varchar(500),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (estado_anterior_solicitud_id) references estados_solicitudes(id) on delete restrict,
foreign key (estado_nuevo_solicitud_id) references estados_solicitudes(id) on delete restrict,
foreign key (usuario_id) references usuarios(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null,
index idx_historial_estados_solicitud (solicitud_id)
);

create table notificaciones (
id int auto_increment primary key,
usuario_id int not null,
mensaje varchar(500) not null,
leida boolean not null default false,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
estado_id int null,
estado_anterior_id int null,
foreign key (usuario_id) references usuarios(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
foreign key (estado_id) references estados_registro(id) on delete set null,
foreign key (estado_anterior_id) references estados_registro(id) on delete set null,
index idx_notificaciones_usuario (usuario_id)
);

insert into niveles_academicos (nombre, descripcion) values
('medio', 'educacion media'),
('universitario', 'educacion universitaria'),
('posgrado', 'estudios de posgrado');

insert into estados_convocatorias (nombre, descripcion) values
('borrador', 'convocatoria en preparacion, no visible a estudiantes'),
('activa', 'convocatoria abierta para recibir solicitudes'),
('cerrada', 'convocatoria finalizada, ya no acepta solicitudes');

insert into estados_solicitudes (nombre, descripcion) values
('pendiente', 'solicitud creada, esperando revision'),
('en_evaluacion', 'solicitud asignada a comite y en proceso de evaluacion'),
('aprobada', 'solicitud aprobada, beca otorgada'),
('rechazada', 'solicitud rechazada'),
('cancelada', 'solicitud cancelada por el estudiante');

insert into estados_documentos (nombre, descripcion) values
('pendiente', 'revision de documentos pendiente'),
('aceptado', 'documentos validados correctamente'),
('rechazado', 'documentos rechazados, requieren correccion');

insert into tipos_becas (nombre, descripcion) values
('academica', 'beca por excelencia o rendimiento academico'),
('deportiva', 'beca por desempeno en disciplinas deportivas'),
('artistica', 'beca por talento en artes, musica o dibujo'),
('tecnica', 'beca para carreras tecnicas o tecnologicas'),
('socioeconomica', 'beca por necesidad economica comprobada');

insert into tipos_documentos (nombre, descripcion) values
('acta_nacimiento', 'partida o certificado de nacimiento'),
('certificado_estudios', 'constancia o certificado de estudios'),
('fotografia', 'fotografia reciente tamano cedula'),
('dpi_escaneado', 'documento personal de identificacion escaneado'),
('constancia_ingresos', 'constancia de ingresos familiares');

insert into servicios (nombre, descripcion) values
('gestion_becas', 'modulo de convocatorias, solicitudes y evaluaciones'),
('seguridad', 'modulo de usuarios, roles y permisos'),
('reportes', 'modulo de reportes y estadisticas');

insert into recursos (nombre, ruta, icono, descripcion, servicio_id) values
('convocatorias', '/convocatorias', 'calendar', 'gestion de convocatorias de becas',
    (select id from servicios where nombre = 'gestion_becas')),
('solicitudes', '/solicitudes', 'file-text', 'gestion de solicitudes de beca',
    (select id from servicios where nombre = 'gestion_becas')),
('comites', '/comites', 'users', 'gestion de comites evaluadores',
    (select id from servicios where nombre = 'gestion_becas')),
('evaluaciones', '/evaluaciones', 'check-square', 'registro de evaluaciones de solicitudes',
    (select id from servicios where nombre = 'gestion_becas')),
('usuarios', '/usuarios', 'user', 'gestion de usuarios internos del sistema',
    (select id from servicios where nombre = 'seguridad')),
('roles', '/roles', 'shield', 'gestion de roles y permisos',
    (select id from servicios where nombre = 'seguridad')),
('reportes', '/reportes', 'bar-chart', 'reportes y estadisticas de becas',
    (select id from servicios where nombre = 'reportes'));


insert into permisos (nombre, descripcion, rol_id, ejecutar, seleccionar, insertar, modificar, eliminar)
select 'permisos de administrador', 'acceso total al sistema', id, true, true, true, true, true
from roles where nombre = 'admin';

insert into permisos (nombre, descripcion, rol_id, ejecutar, seleccionar, insertar, modificar, eliminar)
select 'permisos de evaluador', 'puede consultar y actualizar solicitudes asignadas', id, false, true, false, true, false
from roles where nombre = 'evaluador';

insert into permisos (nombre, descripcion, rol_id, ejecutar, seleccionar, insertar, modificar, eliminar)
select 'permisos de estudiante', 'puede crear, consultar, ejecutar y cancelar sus propias solicitudes', id, true, true, true, false, true
from roles where nombre = 'estudiante';













