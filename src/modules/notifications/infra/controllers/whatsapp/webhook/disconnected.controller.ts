import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/shared/auth/public.decorator';
import { Logger } from '../../../../../../shared/logger/logger.service';
import { DisconnectedWebhookDto } from '../../../dto/webhook/disconnected.dto';
import { DiscordService } from '../../../services/discord.service';

@ApiTags('Webhooks - ZAPI')
@Public()
@Controller('v1/webhooks/zapi')
export class ZapiDisconnectedWebhookController {
    constructor(
        private readonly discord: DiscordService,
        private readonly logger: Logger
    ) { }

    @Post('disconnected')
    async handleDisconnected(
        @Body() body: DisconnectedWebhookDto,
        @Res() res: Response,
    ) {
        try {
            await this.discord.notifyDisconnected(body);
            return res.sendStatus(HttpStatus.OK);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
