import { nanoid } from 'nanoid';
import { Session } from '../../session/entity/session.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  OneToOne,
} from 'typeorm';
import { FilePurpose } from './purpose.entity';
import { StoredFile } from 'src/storage/entity/stored-file.entity';

@Entity()
export class FileMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('filekey-idx')
  @Column({ unique: true, nullable: false })
  key: string;

  @ManyToOne(() => FilePurpose, { nullable: false })
  purpose: FilePurpose;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  validUntil: Date;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => Session, (session) => session.files, { nullable: false })
  session: Session;

  @OneToOne(() => StoredFile, (file) => file.fileMetadata, { nullable: true })
  contents: StoredFile;

  @BeforeInsert()
  private beforeInsert() {
    this.key = nanoid();
  }
}
