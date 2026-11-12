import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Service health and readiness check' })
  check() {
    return {
      status: 'ok',
      service: 'hotel-os-api',
      timestamp: new Date().toISOString(),
    };
  }
}

