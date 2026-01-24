export type WhatsappSendTextInput = {
  phone: string;
  message: string;
};

export type WhatsappSendImageInput = {
  phone: string;
  image: string;
  caption?: string;
  messageId?: string;
  delayMessage?: number;
  viewOnce?: boolean;
};

export type WhatsappSendDocumentInput = {
  phone: string;
  extension: string;
  document: string;
  fileName?: string;
  caption?: string;
  messageId?: string;
  delayMessage?: number;
  editDocumentMessageId?: string;
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
  phone: string;
  message: string;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type WhatsappSendButtonListInput = {
  phone: string;
  message: string;
  buttonList: WhatsappButtonList;
  delayMessage?: number;
};

export type WhatsappSendButtonOtpInput = {
  phone: string;
  message: string;
  code: string;
  image?: string;
  buttonText?: string;
};

export type PixKeyType = 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';

export type WhatsappSendButtonPixInput = {
  phone: string;
  pixKey: string;
  pixType: PixKeyType;
  merchantName?: string;
};

export type WhatsappSendMessageOutput = {
  zaapId: string;
  messageId: string;
  id: string;
};
