import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  purpose: string;

  @IsNotEmpty()
  data: any;
}
