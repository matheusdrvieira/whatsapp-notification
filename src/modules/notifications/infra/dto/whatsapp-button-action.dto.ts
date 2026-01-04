import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class WhatsappButtonActionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CALL', 'URL', 'REPLY'])
  type!: 'CALL' | 'URL' | 'REPLY';

  @ValidateIf((o: WhatsappButtonActionDto) => o.type === 'CALL')
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ValidateIf((o: WhatsappButtonActionDto) => o.type === 'URL')
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsString()
  @IsNotEmpty()
  label!: string;
}

