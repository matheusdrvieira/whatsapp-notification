import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWhatsappButtonOtpNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone!: string;

  @ApiProperty({ example: 'Seu código de verificação é 123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/banner.png',
    description: 'URL de imagem opcional',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'Copiar código',
    description: 'Texto do botão (opcional)',
  })
  @IsOptional()
  @IsString()
  buttonText?: string;
}
