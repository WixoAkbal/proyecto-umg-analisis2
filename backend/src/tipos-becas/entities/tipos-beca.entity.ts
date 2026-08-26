import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AuditoriaCatalogo } from 'src/base/entities/auditoria-catalogo.entity';

@Entity('tipos_becas')
export class TiposBeca extends AuditoriaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;
}
