import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilePurpose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;
}
