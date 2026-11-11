import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('HotelOS-API');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.NEXT_PUBLIC_APP_URL || '',
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Tenant-Id',
      'Idempotency-Key',
    ],
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Hotel OS — Enterprise Hospitality API')
    .setDescription(
      'Unified REST API for Hotel Management SaaS Platform, Property Management System (PMS), Guest Booking Engine, and Platform Super Admin'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'User identity, JWT sessions, lockout protection')
    .addTag('Hotels', 'B2B Hotel onboarding, settings, and KPI dashboard')
    .addTag('Rooms & Inventory', 'Room categories, room statuses, real-time availability')
    .addTag('Reservations & Bookings', 'Booking lifecycle, payments, PMS check-in/out')
    .addTag('Housekeeping Operations', 'Cleaning tasks, checklists, inspection workflow')
    .addTag('Finance & Accounting', 'Revenue reports, expenses, GST invoices')
    .addTag('Super Admin Operations', 'Platform governance, hotel verification, global metrics')
    .addTag('AI & Predictive Analytics', 'Forecasting occupancy, dynamic pricing, cancellation risk')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🏨 Hotel OS API Gateway running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 OpenAPI / Swagger documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
