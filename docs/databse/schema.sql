create database proyecto_umg_analisis2_db;
use proyecto_umg_analisis2_db;

create table usuario ( 
id int auto_increment primary key,
nombre varchar(100) not null,
apellido varchar(100) not null,
email varchar(100) not null unique,
password varchar(100) not null,
rol enum('Estudiante', 'Evaluador', 'Admin') not null,
activo boolean not null default true,
fecha_resgistro datetime not null default current_timestamp
);

create table estudiante ( 
id int auto_increment primary key,
dpi varchar(30) not null,
nivel_academico enum('Medio', 'Universitario', 'Postgrado') not  null,
institucion_educativa varchar(200) not null,
telefono varchar(20),
direccion varchar(255),
foreign key (id) references usuario(id) on delete cascade
);

create table convocatoria ( 
id int auto_increment primary key,
nombre varchar(200) not null,
tipo_beca varchar(100) not null,
descripcion text,
fecha_apertura date not null,
fecha_cierre date not null,
cupos_disponibles int not null default 0,
estado enum('Borrador', 'Activa', 'Cerrada') not null default 'Borrador',
fecha_asignacion datetime not null default current_timestamp 
);

create table comite ( 
id int auto_increment primary key,
nombre varchar(200) not null, 
activo boolean not null default true,
fecha_creacion datetime not null default current_timestamp
);

create table comite_miembro ( 
comite_id int not null,
evaluador_id int not null,
fecha_asignacion datetime not null default current_timestamp,
primary key (comite_id, evaluador_id),
foreign key (comite_id) references comite(id) on delete cascade,
foreign key (evaluador_id) references usuario(id) on delete cascade
);

create table solicitud (  
id int auto_increment primary key,
estudiante_id int not null,
convocatoria_id int not null,
comite_id int null,
estado enum('Pendiente', 'En_Evaluacion', 'Aprobada', 'Rechazada', 'Cancelada') not null default 'Pendiente',
fecha_solicitud datetime not null default current_timestamp,
foreign key (estudiante_id) references estudiante(id) on delete cascade,
foreign key (convocatoria_id) references convocatoria(id) on delete restrict,
foreign key (comite_id) references comite(id) on delete set null,
index idx_solicitud_estudiante (estudiante_id),
index idx_solicitud_convocatoria (convocatoria_id),
index idx_solicitud_estado (estado)
);

create table documento ( 
id int auto_increment primary key,
solicitud_id int not null,
tipo_documento varchar(100) not null, 
ruta_archivo varchar(500) not null,
estado_validacion enum('Pendiente', 'Aceptado', 'Rechazado') not null default 'Pendiente',
fecha_carga datetime not null default current_timestamp,
foreign key (solicitud_id) references solicitud(id) on delete cascade,
index idx_documento_solicitud (solicitud_id)
);

create table evaluaciones ( 
id int auto_increment primary key,
solicitud_id int not null,
evaluador_id int not null,
puntaje decimal(5,2) not null,
observaciones text,
fecha_evaluacion datetime not null default current_timestamp,
foreign key (solicitud_id) references solicitud(id) on delete cascade, 
foreign key (evaluador_id) references usuario(id) on delete restrict, 
index idx_evaluacion_solicitud (solicitud_id)
);

create table historial_estado (  
id  int auto_increment primary key,
solicitud_id int not null,
estado_anterior varchar(50),
estado_nuevo varchar(50),
usuario_id int not null,
comentario varchar(500),
fecha_cambio datetime not null default current_timestamp,
foreign key (solicitud_id) references solicitud(id) on delete cascade,
foreign key (usuario_id) references usuario(id) on delete restrict,
index edx_historial_solicitud (solicitud_id)
);

create table notificcion (  
id int auto_increment primary key,
usuario_id int not null,
mensaje varchar(500) not null,
leida boolean not null default false,
fecha_creacion datetime not null default current_timestamp,
foreign key (usuario_id) references usuario(id) on delete cascade,
index idx_notificacion_usuario (usuario_id)
);































