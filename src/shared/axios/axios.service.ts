import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { AxiosInstance } from 'axios';
import { env } from '../../config/env';

@Injectable()
export class AxiosService {
  readonly axios: AxiosInstance;

  constructor(httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  build = (
    baseURL: string,
    config?: {
      headers?: Record<string, string>;
    },
  ): AxiosInstance => this.axios.create({ baseURL, ...(config ?? {}) });

  public zapi = (): AxiosInstance =>
    this.build(
      `https://api.z-api.io/instances/${env.ZAPI_INSTANCE_ID}/token/${env.ZAPI_TOKEN}`,
      {
        headers: {
          'Client-Token': env.ZAPI_CLIENT_TOKEN,
        },
      },
    );
}
