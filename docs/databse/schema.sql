create database proyecto_umg_analisis2_db;
use proyecto_umg_analisis2_db;

create table roles (
id int auto_increment primary key,
codigo varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp
);

create table niveles_academicos (
id int auto_increment primary key,
codigo varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp
);

create table estados_convocatorias (
id int auto_increment primary key,
codigo varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp
);

create table estados_solicitudes (
id int auto_increment primary key,
codigo varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp
);

create table estados_documentos (
id int auto_increment primary key,
codigo varchar(50) not null unique,
descripcion varchar(200),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp
);



create table usuarios (
id int auto_increment primary key,
nombre varchar(100) not null,
apellido varchar(100) not null,
email varchar(150) not null unique,
password varchar(255) not null,
rol_id int not null,
activo boolean not null default true,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (rol_id) references roles(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null
);



create table estudiantes (
id int primary key,
dpi varchar(20) not null unique,
nivel_academico_id int not null,
institucion_educativa varchar(200) not null,
telefono varchar(20),
direccion varchar(255),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (id) references usuarios(id) on delete cascade,
foreign key (nivel_academico_id) references niveles_academicos(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null
);


create table convocatorias (
id int auto_increment primary key,
nombre varchar(200) not null,
tipo_beca varchar(100) not null,
descripcion text,
fecha_apertura date not null,
fecha_cierre date not null,
cupos_disponibles int not null default 0,
estado_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (estado_id) references estados_convocatorias(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null
);



create table comites (
id int auto_increment primary key,
nombre varchar(150) not null,
activo boolean not null default true,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null
);


create table comites_miembros (
comite_id int not null,
evaluador_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
primary key (comite_id, evaluador_id),
foreign key (comite_id) references comites(id) on delete cascade,
foreign key (evaluador_id) references usuarios(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null
);



create table solicitudes (
id int auto_increment primary key,
estudiante_id int not null,
convocatoria_id int not null,
comite_id int null,
estado_id int not null,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (estudiante_id) references estudiantes(id) on delete cascade,
foreign key (convocatoria_id) references convocatorias(id) on delete restrict,
foreign key (comite_id) references comites(id) on delete set null,
foreign key (estado_id) references estados_solicitudes(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
index idx_solicitudes_estudiante (estudiante_id),
index idx_solicitudes_convocatoria (convocatoria_id),
index idx_solicitudes_estado (estado_id)
);



create table documentos (
id int auto_increment primary key,
solicitud_id int not null,
tipo_documento varchar(100) not null,
ruta_archivo varchar(500) not null,
estado_validacion_id int not null,
comentario_revision varchar(500),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (estado_validacion_id) references estados_documentos(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
index idx_documentos_solicitud (solicitud_id)
);




create table evaluaciones (
id int auto_increment primary key,
solicitud_id int not null,
evaluador_id int not null,
puntaje decimal(5,2) not null,
observaciones text,
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (evaluador_id) references usuarios(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
index idx_evaluaciones_solicitud (solicitud_id)
);



create table historial_estados (
id int auto_increment primary key,
solicitud_id int not null,
estado_anterior_id int null,
estado_nuevo_id int not null,
usuario_id int not null,
comentario varchar(500),
creado_por int null,
fecha_hora_creado datetime not null default current_timestamp,
modificado_por int null,
fecha_hora_modificado datetime null on update current_timestamp,
foreign key (solicitud_id) references solicitudes(id) on delete cascade,
foreign key (estado_anterior_id) references estados_solicitudes(id) on delete restrict,
foreign key (estado_nuevo_id) references estados_solicitudes(id) on delete restrict,
foreign key (usuario_id) references usuarios(id) on delete restrict,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
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
foreign key (usuario_id) references usuarios(id) on delete cascade,
foreign key (creado_por) references usuarios(id) on delete set null,
foreign key (modificado_por) references usuarios(id) on delete set null,
index idx_notificaciones_usuario (usuario_id)
);



insert into roles (codigo, descripcion) values
('Estudiante', 'usuario que aplica a becas'),
('Evaluador', 'usuario que evalua solicitudes'),
('Admin', 'usuario administrador del sistema');

insert into niveles_academicos (codigo, descripcion) values
('Medio', 'educacion media'),
('Universitario', 'educacion universitaria'),
('Posgrado', 'estudios de posgrado');

insert into estados_convocatorias (codigo, descripcion) values
('Borrador', 'convocatoria en preparacion, no visible a estudiantes'),
('Activa', 'convocatoria abierta para recibir solicitudes'),
('Cerrada', 'convocatoria finalizada, ya no acepta solicitudes');

insert into estados_solicitudes (codigo, descripcion) values
('Pendiente', 'solicitud creada, esperando revision'),
('En_Evaluacion', 'solicitud asignada a comite y en proceso de evaluacion'),
('Aprobada', 'solicitud aprobada, beca otorgada'),
('Rechazada', 'solicitud rechazada'),
('Cancelada', 'solicitud cancelada por el estudiante');

insert into estados_documentos (codigo, descripcion) values
('Pendiente', 'documento cargado, esperando revision'),
('Aceptado', 'documento validado correctamente'),
('Rechazado', 'documento rechazado, requiere correccion');