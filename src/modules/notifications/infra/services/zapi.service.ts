import { BadRequestException, Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { AxiosService } from '../../../../shared/axios/axios.service';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import {
  SendButtonActionsInput,
  SendButtonOtpInput,
  SendButtonPixInput,
  SendMessageOutput,
  SendTextInput,
  WhatsappRepository,
} from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ZapiWhatsappService extends WhatsappRepository {
  constructor(
    private readonly axios: AxiosService,
    private readonly logger: AppLogger,
  ) {
    super();
  }

  async sendText(input: SendTextInput): Promise<SendMessageOutput> {
    try {
      return await this.axios.zapi().post('/send-text', {
        phone: input.to,
        message: input.message,
      });

    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }

  async sendButtonActions(input: SendButtonActionsInput): Promise<SendMessageOutput> {
    try {
      return await this.axios.zapi().post('/send-button-actions', {
        phone: input.to,
        message: input.message,
        title: input.title,
        footer: input.footer,
        delayMessage: input.delayMessage,
        buttonActions: input.buttonActions,
      });
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }

  async sendButtonOtp(input: SendButtonOtpInput): Promise<SendMessageOutput> {
    try {
      return await this.axios.zapi().post('/send-button-otp', {
        phone: input.to,
        message: input.message,
        code: input.code,
        image: input.image,
        buttonText: input.buttonText,
      });
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }

  async sendButtonPix(input: SendButtonPixInput): Promise<SendMessageOutput> {
    try {
      return await this.axios.zapi().post('/send-button-pix', {
        phone: input.to,
        pixKey: input.pixKey,
        type: input.type,
        merchantName: input.merchantName,
      });
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }
}
