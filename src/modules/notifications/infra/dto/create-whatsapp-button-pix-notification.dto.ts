import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateWhatsappButtonPixNotificationDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @IsString()
  @IsNotEmpty()
  pixKey!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP'])
  pixType!: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

  @IsOptional()
  @IsString()
  merchantName?: string;
}

