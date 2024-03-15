import { IsNotEmpty } from 'class-validator';

export class RetrieveFileDto {
  @IsNotEmpty()
  key: string;
}
