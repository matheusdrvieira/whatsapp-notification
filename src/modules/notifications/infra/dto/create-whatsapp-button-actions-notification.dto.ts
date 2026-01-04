import { Type } from 'class-transformer';
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
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WhatsappButtonActionDto)
  buttonActions!: WhatsappButtonActionDto[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  delayMessage?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  footer?: string;
}

