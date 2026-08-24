import { UserRole } from 'src/user-role/entity/user-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditoriaCatalogo } from '../../base/entities/auditoria-catalogo.entity';

@Entity('roles')
export class Role extends AuditoriaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string;

  @OneToMany(() => UserRole, (userRole) => userRole.rol)
  usuarios: UserRole[];
}
