import { FileMetadata } from 'src/file/entity/file.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class StoredFile {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creationDate: Date;

  @Column({ type: 'text', nullable: false })
  b64Contents: string;

  @OneToOne(() => FileMetadata, (metadata) => metadata.id, { nullable: false })
  @JoinColumn()
  fileMetadata: FileMetadata;
}
