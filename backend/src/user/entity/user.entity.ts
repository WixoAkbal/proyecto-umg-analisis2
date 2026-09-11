import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { UserRole } from '../../user-role/entity/user-role.entity';

@Entity('usuarios')
export class User extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', length: 100, nullable: false })
  nombre: String;

  @Column({ name: 'apellido', length: 100, nullable: false })
  apellido: String;

  @Column({ name: 'correo_electronico', length: 150, unique: true })
  correoElectronico: String;

  @Column({ name: 'contrasenia', length: 250, nullable: false })
  contrasenia: String;

  @OneToMany(() => UserRole, (userRole) => userRole.usuario)
  roles: UserRole[];
}