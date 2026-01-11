import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/shared/auth/public.decorator';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
