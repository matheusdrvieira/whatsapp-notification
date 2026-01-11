import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class MessageStatusDto {
    @ApiProperty({ example: 'instance.id' })
    @IsString()
    instanceId!: string;

    @ApiProperty({ example: 'SENT' })
    @IsString()
    status!: string;

    @ApiProperty({ type: [String], example: ['999999999999999999999'] })
    @IsArray()
    @IsString({ each: true })
    ids!: string[];

    @ApiProperty({ example: 1632234645000 })
    @IsInt()
    momment!: number;

    @ApiProperty({ example: 0 })
    @IsInt()
    phoneDevice!: number;

    @ApiProperty({ example: '5544999999999' })
    @IsString()
    phone!: string;

    @ApiProperty({ example: 'MessageStatusCallback' })
    @IsString()
    type!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isGroup!: boolean;
}
