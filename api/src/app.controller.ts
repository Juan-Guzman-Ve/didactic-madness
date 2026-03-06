import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): { message: string; timestamp: string } {
    return {
      message: 'PC Parts Store API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ping')
  ping(): { pong: boolean } {
    return { pong: true };
  }
}
