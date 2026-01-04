import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateIf,
  ValidateNested,
  IsIn,
  IsInt,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../../domain/enums/notification-type.enum';

class ButtonActionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CALL', 'URL', 'REPLY'])
  type!: 'CALL' | 'URL' | 'REPLY';

  @ValidateIf((o: ButtonActionDto) => o.type === 'CALL')
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ValidateIf((o: ButtonActionDto) => o.type === 'URL')
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsString()
  @IsNotEmpty()
  label!: string;
}

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  to!: string;

  @ValidateIf((o: CreateNotificationDto) => o.type !== NotificationType.BUTTON_PIX)
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_ACTIONS)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ButtonActionDto)
  buttonActions?: ButtonActionDto[];

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_ACTIONS)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  delayMessage?: number;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_ACTIONS)
  @IsOptional()
  @IsString()
  title?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_ACTIONS)
  @IsOptional()
  @IsString()
  footer?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_OTP)
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_OTP)
  @IsOptional()
  @IsString()
  image?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_OTP)
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_PIX)
  @IsString()
  @IsNotEmpty()
  pixKey?: string;

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_PIX)
  @IsString()
  @IsNotEmpty()
  @IsIn(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP'])
  pixType?: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

  @ValidateIf((o: CreateNotificationDto) => o.type === NotificationType.BUTTON_PIX)
  @IsOptional()
  @IsString()
  merchantName?: string;
}
