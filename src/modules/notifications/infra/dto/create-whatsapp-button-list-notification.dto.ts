import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';
import { WhatsappButtonListDto } from './whatsapp-button-list.dto';

export class CreateWhatsappButtonListNotificationDto {
  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @ApiProperty({ example: 'Z-API is good?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @ApiProperty({
    type: () => WhatsappButtonListDto,
    example: {
      image: 'https://avatars.githubusercontent.com/u/60630101?s=280&v=4',
      buttons: [
        { id: '1', label: 'Great' },
        { id: '2', label: 'Excellent' },
      ],
    },
  })
  @ValidateNested()
  @Type(() => WhatsappButtonListDto)
  buttonList!: WhatsappButtonListDto;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  delayMessage?: number;
}
