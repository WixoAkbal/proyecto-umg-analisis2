import { Role } from "src/roles/entities/role.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.roles)
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @ManyToOne(() => Role, (role) => role.usuarios)
    @JoinColumn({ name: 'rol_id' })
    rol: Role;

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
}