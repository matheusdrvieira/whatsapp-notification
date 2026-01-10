import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
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

export class CreateWhatsappImageNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @ApiProperty({
    example: 'https://www.z-api.io/wp-content/themes/z-api/dist/images/logo.svg',
    description: 'Image URL or base64 with data:image/png;base64, prefix',
  })
  @IsString()
  @IsNotEmpty()
  image!: string;

  @ApiPropertyOptional({ example: 'Logo' })
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

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  viewOnce: boolean = false;
}
