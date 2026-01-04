export type SendTextInput = {
  to: string;
  message: string;
};

export type WhatsappButtonAction =
  | {
      id?: string;
      type: 'CALL';
      phone: string;
      label: string;
    }
  | {
      id?: string;
      type: 'URL';
      url: string;
      label: string;
    }
  | {
      id?: string;
      type: 'REPLY';
      label: string;
    };

export type SendButtonActionsInput = {
  to: string;
  message: string;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type SendButtonOtpInput = {
  to: string;
  message: string;
  code: string;
  image?: string;
  buttonText?: string;
};

export type PixKeyType = 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

export type SendButtonPixInput = {
  to: string;
  pixKey: string;
  type: PixKeyType;
  merchantName?: string;
};

export type SendMessageOutput = {
  zaapId: string;
  messageId: string;
  id: string;
};

export abstract class WhatsappRepository {
  abstract sendText(input: SendTextInput): Promise<SendMessageOutput>;

  abstract sendButtonActions(input: SendButtonActionsInput): Promise<SendMessageOutput>;

  abstract sendButtonOtp(input: SendButtonOtpInput): Promise<SendMessageOutput>;

  abstract sendButtonPix(input: SendButtonPixInput): Promise<SendMessageOutput>;
}
