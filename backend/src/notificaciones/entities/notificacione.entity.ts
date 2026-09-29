import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { User } from '../../user/entity/user.entity';

@Entity('notificaciones')
export class Notificacion extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  mensaje: string;

  @Column({ type: 'boolean', default: false })
  leida: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}