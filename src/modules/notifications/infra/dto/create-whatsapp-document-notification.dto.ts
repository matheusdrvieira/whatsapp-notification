import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWhatsappDocumentNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone!: string;

  @ApiProperty({
    example: 'https://expoforest.com.br/wp-content/uploads/2017/05/exemplo.pdf',
    description: 'Document URL or base64 with data:application/pdf;base64, prefix',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiPropertyOptional({ example: 'Meu PDF' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({ example: 'Descricao do arquivo' })
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  caption?: string;

  @ApiPropertyOptional({ example: 'D241XXXX732339502B68' })
  @IsOptional()
  @IsString()
  messageId?: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  delayMessage?: number;

  @ApiPropertyOptional({ example: 'D241XXXX732339502B68' })
  @IsOptional()
  @IsString()
  editDocumentMessageId?: string;
}
