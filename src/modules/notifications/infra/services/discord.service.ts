import { Injectable } from '@nestjs/common';
import { AxiosService } from '../../../../shared/axios/axios.service';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { formatEventDisconnected } from '../../../../shared/utils/discord.utils';
import { EventDisconnectedInput } from '../../domain/types/webhook/disconnected.types';

@Injectable()
export class DiscordService {
    constructor(
        private readonly axios: AxiosService,
        private readonly logger: AppLogger
    ) { }

    async notify(input: EventDisconnectedInput) {
        try {
            await this.axios.discord().post('', formatEventDisconnected(input));
        } catch (err) {
            this.logger.error(err);
        }
    }
}
