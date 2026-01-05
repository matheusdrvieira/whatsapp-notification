import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class WhatsappButtonActionDto {
  @ApiPropertyOptional({ example: 'btn-1' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiProperty({ enum: ['CALL', 'URL', 'REPLY'], example: 'URL' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CALL', 'URL', 'REPLY'])
  type!: 'CALL' | 'URL' | 'REPLY';

  @ApiPropertyOptional({ example: '5511999999999', description: 'Obrigatório quando type=CALL' })
  @ValidateIf((o: WhatsappButtonActionDto) => o.type === 'CALL')
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com', description: 'Obrigatório quando type=URL' })
  @ValidateIf((o: WhatsappButtonActionDto) => o.type === 'URL')
  @IsString()
  @IsNotEmpty()
  url?: string;

  @ApiProperty({ example: 'Acessar' })
  @IsString()
  @IsNotEmpty()
  label!: string;
}
