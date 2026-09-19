import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';
import { TiposDocumento } from '../../tipos-documentos/entities/tipos-documento.entity';

@Entity('documentos')
export class Documento extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ name: 'tipo_archivo', type: 'varchar', length: 20 })
  tipoArchivo: string;

  @Column({ type: 'longblob' })
  archivo: Buffer;

  @Column({ name: 'comentario_revision', type: 'varchar', length: 500, nullable: true })
  comentarioRevision: string;

  @ManyToOne(() => Solicitud)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => TiposDocumento)
  @JoinColumn({ name: 'tipo_documento_id' })
  tipoDocumento: TiposDocumento;
}