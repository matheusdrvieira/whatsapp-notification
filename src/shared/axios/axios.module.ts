import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15_000,
      maxRedirects: 5,
    }),
  ],
  providers: [AxiosService],
  exports: [AxiosService],
})
export class AxiosModule {}
