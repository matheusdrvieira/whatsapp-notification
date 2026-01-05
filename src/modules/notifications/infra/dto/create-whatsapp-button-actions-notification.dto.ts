import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { WhatsappButtonActionDto } from './whatsapp-button-action.dto';

export class CreateWhatsappButtonActionsNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @ApiProperty({ example: 'Escolha uma opção:' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @ApiProperty({
    type: () => [WhatsappButtonActionDto],
    example: [
      { type: 'URL', label: 'Acessar', url: 'https://example.com' },
      { type: 'CALL', label: 'Ligar', phone: '5511999999999' },
      { type: 'REPLY', label: 'Responder' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WhatsappButtonActionDto)
  buttonActions!: WhatsappButtonActionDto[];

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  delayMessage?: number;

  @ApiPropertyOptional({ example: 'Título (opcional)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Rodapé (opcional)' })
  @IsOptional()
  @IsString()
  footer?: string;
}
