import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { AxiosService } from '../../../../shared/axios/axios.service';
import {
  SendTextInput,
  WhatsappRepository,
} from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ZapiWhatsappService extends WhatsappRepository {
  constructor(
    private readonly axios: AxiosService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async sendText(input: SendTextInput): Promise<void> {
    try {
      await this.axios.zapi().post('/send-text', {
        phone: input.to,
        message: input.message,
      });

    } catch (err) {
      this.logger.error(err.message, err.stack);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }
}
