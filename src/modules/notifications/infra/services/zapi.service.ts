import { BadRequestException, Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { AxiosService } from '../../../../shared/axios/axios.service';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import type {
  WhatsappSendButtonActionsInput,
  WhatsappSendButtonOtpInput,
  WhatsappSendButtonPixInput,
  WhatsappSendMessageOutput,
  WhatsappSendTextInput,
} from '../../domain/types/whatsapp.types';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ZapiWhatsappService extends WhatsappRepository {
  constructor(
    private readonly axios: AxiosService,
    private readonly logger: AppLogger,
  ) {
    super();
  }

  async sendText(input: WhatsappSendTextInput): Promise<WhatsappSendMessageOutput> {
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

  async sendButtonActions(
    input: WhatsappSendButtonActionsInput,
  ): Promise<WhatsappSendMessageOutput> {
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

  async sendButtonOtp(
    input: WhatsappSendButtonOtpInput,
  ): Promise<WhatsappSendMessageOutput> {
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

  async sendButtonPix(
    input: WhatsappSendButtonPixInput,
  ): Promise<WhatsappSendMessageOutput> {
    try {
      return await this.axios.zapi().post('/send-button-pix', {
        phone: input.to,
        pixKey: input.pixKey,
        type: input.pixType,
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
