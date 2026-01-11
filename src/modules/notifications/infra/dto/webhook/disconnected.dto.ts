import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class DisconnectedWebhookDto {
    @ApiProperty({ example: 1580163342 })
    @IsInt()
    momment!: number;

    @ApiProperty({ example: 'Device has been disconnected' })
    @IsString()
    error!: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    disconnected!: boolean;

    @ApiProperty({ example: 'DisconnectedCallback' })
    @IsString()
    type!: string;

    @ApiProperty({ example: 'instance.id' })
    @IsString()
    instanceId!: string;
}
