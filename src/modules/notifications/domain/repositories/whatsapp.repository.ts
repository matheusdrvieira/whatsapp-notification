export type SendTextInput = {
  to: string;
  message: string;
};

export abstract class WhatsappRepository {
  abstract sendText(input: SendTextInput): Promise<void>;
}
