import { Module } from '@nestjs/common';
import { AxiosModule } from '../../../../shared/axios/axios.module';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { ZapiWhatsappService } from './zapi.service';

@Module({
  imports: [AxiosModule],
  providers: [
    {
      provide: WhatsappRepository,
      useClass: ZapiWhatsappService,
    },
  ],
  exports: [WhatsappRepository],
})
export class ServiceModule {}
