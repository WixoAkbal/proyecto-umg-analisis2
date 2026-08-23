
import { UserRole } from "src/user-role/entity/user-role.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nombre', length: 100, nullable: false })
    nombre: string;

    @Column({ name: 'apellido', length: 100, nullable: false })
    apellido: string;

    @Column({ name: 'correo_electronico', length: 150, unique: true })
    correoElectronico: string;

    @Column({ name: 'contrasenia', length: 250, nullable: false })
    contrasenia: string;

    @Column({ name: 'creado_por', nullable: false })
    creadoPor: number;

    @CreateDateColumn({ name: 'fecha_hora_creado', nullable: false })
    fechaHoraCreado: Date;

    @Column({ name: 'modificado_por', nullable: true })
    modificadoPor: number;

    @UpdateDateColumn({ name: 'fecha_hora_modificado', nullable: true })
    fechaHoraModificado: Date;

    @Column({ name: 'estado_id', nullable: false })
    estado_id: boolean;

    @Column({ name: 'estado_anterior_id', nullable: true })
    estado_anterior_id: boolean;

    @OneToMany(() => UserRole, (userRole) => userRole.usuario)
    roles: UserRole[];
}