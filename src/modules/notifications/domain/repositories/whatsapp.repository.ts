import type {
  WhatsappSendButtonActionsInput,
  WhatsappSendButtonListInput,
  WhatsappSendButtonOtpInput,
  WhatsappSendButtonPixInput,
  WhatsappSendImageInput,
  WhatsappSendMessageOutput,
  WhatsappSendTextInput,
} from '../types/whatsapp.types';

export abstract class WhatsappRepository {
  abstract sendText(input: WhatsappSendTextInput): Promise<WhatsappSendMessageOutput>;
  abstract sendImage(input: WhatsappSendImageInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonActions(input: WhatsappSendButtonActionsInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonList(input: WhatsappSendButtonListInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonOtp(input: WhatsappSendButtonOtpInput): Promise<WhatsappSendMessageOutput>;
  abstract sendButtonPix(input: WhatsappSendButtonPixInput): Promise<WhatsappSendMessageOutput>;
}
