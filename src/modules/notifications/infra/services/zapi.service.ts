import { BadRequestException, Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { AxiosService } from '../../../../shared/axios/axios.service';
import { Logger } from '../../../../shared/logger/logger.service';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import type {
  WhatsappSendButtonActionsInput,
  WhatsappSendButtonListInput,
  WhatsappSendButtonOtpInput,
  WhatsappSendButtonPixInput,
  WhatsappSendDocumentInput,
  WhatsappSendImageInput,
  WhatsappSendMessageOutput,
  WhatsappSendTextInput,
} from '../../domain/types/whatsapp.types';

@Injectable()
export class ZapiWhatsappService extends WhatsappRepository {
  constructor(
    private readonly axios: AxiosService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async sendText(input: WhatsappSendTextInput): Promise<WhatsappSendMessageOutput> {
    try {
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-text', {
        phone: input.phone,
        message: input.message,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }

  async sendImage(input: WhatsappSendImageInput): Promise<WhatsappSendMessageOutput> {
    try {
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-image', {
        phone: input.phone,
        image: input.image,
        caption: input.caption,
        messageId: input.messageId,
        delayMessage: input.delayMessage,
        viewOnce: input.viewOnce,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-image failed`, err);
      }
      throw err;
    }
  }

  async sendDocument(input: WhatsappSendDocumentInput): Promise<WhatsappSendMessageOutput> {
    try {
      const extension = encodeURIComponent(input.extension);
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>(`/send-document/${extension}`, {
        phone: input.phone,
        document: input.document,
        fileName: input.fileName,
        caption: input.caption,
        messageId: input.messageId,
        delayMessage: input.delayMessage,
        editDocumentMessageId: input.editDocumentMessageId,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-document failed`, err);
      }
      throw err;
    }
  }

  async sendButtonActions(
    input: WhatsappSendButtonActionsInput,
  ): Promise<WhatsappSendMessageOutput> {
    try {
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-button-actions', {
        phone: input.phone,
        message: input.message,
        title: input.title,
        footer: input.footer,
        delayMessage: input.delayMessage,
        buttonActions: input.buttonActions,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }

  async sendButtonList(
    input: WhatsappSendButtonListInput,
  ): Promise<WhatsappSendMessageOutput> {
    try {
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-button-list', {
        phone: input.phone,
        message: input.message,
        buttonList: input.buttonList,
        delayMessage: input.delayMessage,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-button-list failed`, err);
      }
      throw err;
    }
  }

  async sendButtonOtp(
    input: WhatsappSendButtonOtpInput,
  ): Promise<WhatsappSendMessageOutput> {
    try {
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-button-otp', {
        phone: input.phone,
        message: input.message,
        code: input.code,
        image: input.image,
        buttonText: input.buttonText,
      });

      return data;
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
      const { data } = await this.axios.zapi().post<WhatsappSendMessageOutput>('/send-button-pix', {
        phone: input.phone,
        pixKey: input.pixKey,
        type: input.pixType,
        merchantName: input.merchantName,
      });

      return data;
    } catch (err) {
      this.logger.error(err);

      if (isAxiosError(err)) {
        throw new BadRequestException(`ZAPI send-text failed`, err);
      }
      throw err;
    }
  }
}
