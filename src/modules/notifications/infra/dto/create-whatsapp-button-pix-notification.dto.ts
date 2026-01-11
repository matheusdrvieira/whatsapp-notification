import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateWhatsappButtonPixNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone!: string;

  @ApiProperty({ example: 'chave-pix@exemplo.com' })
  @IsString()
  @IsNotEmpty()
  pixKey!: string;

  @ApiProperty({ enum: ['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP'], example: 'EMAIL' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP'])
  pixType!: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

  @ApiPropertyOptional({ example: 'Minha Loja LTDA' })
  @IsOptional()
  @IsString()
  merchantName?: string;
}
