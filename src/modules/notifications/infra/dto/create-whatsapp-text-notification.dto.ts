import { IsNotEmpty, IsNumberString, IsString, Length, MaxLength } from 'class-validator';

export class CreateWhatsappTextNotificationDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;
}

