import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WhatsappButtonListButtonDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiProperty({ example: 'Great' })
  @IsString()
  @IsNotEmpty()
  label!: string;
}

export class WhatsappButtonListDto {
  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/60630101?s=280&v=4',
    description: 'Image URL or base64 with data:image/png;base64, prefix',
  })
  @IsString()
  @IsNotEmpty()
  image!: string;

  @ApiProperty({
    type: () => [WhatsappButtonListButtonDto],
    example: [
      { id: '1', label: 'Great' },
      { id: '2', label: 'Excellent' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WhatsappButtonListButtonDto)
  buttons!: WhatsappButtonListButtonDto[];
}
