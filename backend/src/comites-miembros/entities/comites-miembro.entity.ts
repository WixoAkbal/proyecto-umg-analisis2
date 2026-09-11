import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Comite } from '../../comites/entities/comite.entity';
import { User } from '../../user/entity/user.entity';

@Entity('comites_miembros')
export class ComitesMiembro extends AuditoriaOperativa {
  @PrimaryColumn({ name: 'comite_id' })
  comiteId: number;

  @PrimaryColumn({ name: 'evaluador_id' })
  evaluadorId: number;

  @ManyToOne(() => Comite)
  @JoinColumn({ name: 'comite_id' })
  comite: Comite;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluador_id' })
  evaluador: User;
}