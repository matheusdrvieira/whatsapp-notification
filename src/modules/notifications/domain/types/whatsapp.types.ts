export type WhatsappSendTextInput = {
  to: string;
  message: string;
};

export type WhatsappSendImageInput = {
  to: string;
  image: string;
  caption?: string;
  messageId?: string;
  delayMessage?: number;
  viewOnce?: boolean;
};

export type WhatsappButtonListButton = {
  id?: string;
  label: string;
};

export type WhatsappButtonList = {
  image: string;
  buttons: WhatsappButtonListButton[];
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

export type WhatsappSendButtonActionsInput = {
  to: string;
  message: string;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type WhatsappSendButtonListInput = {
  to: string;
  message: string;
  buttonList: WhatsappButtonList;
  delayMessage?: number;
};

export type WhatsappSendButtonOtpInput = {
  to: string;
  message: string;
  code: string;
  image?: string;
  buttonText?: string;
};

export type PixKeyType = 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

export type WhatsappSendButtonPixInput = {
  to: string;
  pixKey: string;
  pixType: PixKeyType;
  merchantName?: string;
};

export type WhatsappSendMessageOutput = {
  zaapId: string;
  messageId: string;
  id: string;
};
