import type {
  WhatsappSendButtonActionsInput,
  WhatsappSendButtonOtpInput,
  WhatsappSendButtonPixInput,
  WhatsappSendMessageOutput,
  WhatsappSendTextInput,
} from '../types/whatsapp.types';

export abstract class WhatsappRepository {
  abstract sendText(input: WhatsappSendTextInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonActions(input: WhatsappSendButtonActionsInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonOtp(input: WhatsappSendButtonOtpInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonPix(input: WhatsappSendButtonPixInput): Promise<WhatsappSendMessageOutput>;
}
