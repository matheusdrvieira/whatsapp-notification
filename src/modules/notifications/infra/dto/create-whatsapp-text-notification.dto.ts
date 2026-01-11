import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length, MaxLength } from 'class-validator';

export class CreateWhatsappTextNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone!: string;

  @ApiProperty({ example: 'Olá! Sua notificação foi enviada com sucesso.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;
}
