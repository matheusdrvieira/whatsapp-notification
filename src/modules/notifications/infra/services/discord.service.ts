import { Injectable } from '@nestjs/common';
import { env } from 'src/config/env';
import { AxiosService } from '../../../../shared/axios/axios.service';
import { formatEventDisconnected, formatSystemError } from '../../../../shared/utils/discord.utils';
import { EventDisconnectedInput } from '../../domain/types/webhook/disconnected.types';

@Injectable()
export class DiscordService {
    constructor(private readonly axios: AxiosService) { }

    async notifyDisconnected(input: EventDisconnectedInput) {
        await this.axios.discord(env.DISCORD_EVENT_DISCONNECTED).post('', formatEventDisconnected(input));
    }

    async notifyErrors(input: any) {
        await this.axios.discord(env.DISCORD_EVENT_ERROR).post('', formatSystemError(input));
    }
}
