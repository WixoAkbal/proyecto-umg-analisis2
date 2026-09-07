import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../user/entity/user.entity';

@Entity('usuarios_roles')
export class UserRole extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => Role, (role) => role.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Role;
}