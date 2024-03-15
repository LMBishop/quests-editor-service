import { FileMetadata } from '../../file/entity/file.entity';
import { Entity, Column, BeforeInsert, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('sessiontoken-idx')
  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  validUntil: Date;

  @Column({ default: false })
  used: boolean;

  @OneToMany(() => FileMetadata, (file) => file.session)
  files: FileMetadata[];

  @BeforeInsert()
  private beforeInsert() {
    this.token = nanoid();
  }
}
