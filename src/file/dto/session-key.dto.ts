import { IsNotEmpty } from 'class-validator';

export class SessionTokenDto {
  @IsNotEmpty()
  token: string;
}
