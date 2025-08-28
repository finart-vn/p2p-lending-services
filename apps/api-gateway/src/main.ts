import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayConfig, CONFIG_TOKENS } from '@p2p-lending/common/config';
import * as cookieParser from 'cookie-parser';

import { ApiGatewayModule } from './api-gateway.module';
import { HttpExceptionFilter } from './applications/filters/http-exception.filter';
import { ResponseInterceptor } from './applications/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'ApiGateway',
  });
  const app = await NestFactory.create(ApiGatewayModule, {
    logger,
  });
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = app.get<ApiGatewayConfig>(CONFIG_TOKENS.API_GATEWAY);

  app.useGlobalInterceptors(new ResponseInterceptor());

  // Configure cookie parser with secret for signed cookies
  const cookieSecret = config.jwt?.secret || 'DefaultSecret';
  app.use(cookieParser(cookieSecret));

  if (config.globalPrefix) {
    app.setGlobalPrefix(config.globalPrefix);
  }

  // CORS Configuration
  if (config.cors?.enabled) {
    app.enableCors({
      origin: config.cors.origins,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      credentials: config.cors.credentials,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation
  if (config.swagger?.enabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.swagger.title || 'P2P Lending API Gateway')
      .setDescription(
        config.swagger.description || 'API Gateway for P2P Lending',
      )
      .setVersion(config.swagger.version || '1.0')
      .addBearerAuth();

    // Add tags if specified
    if (config.swagger.tags) {
      config.swagger.tags.forEach((tag) => swaggerConfig.addTag(tag));
    }

    const document = SwaggerModule.createDocument(app, swaggerConfig.build());
    SwaggerModule.setup(config.swagger.path || 'api-docs', app, document);
  }

  await app.listen(config.port);

  logger.log(`🚀 ${config.serviceName} is running on port ${config.port}`);
  logger.log(`🌍 Environment: ${config.environment}`);
  logger.log(`📊 Log Level: ${config.logLevel}`);

  if (config.globalPrefix) {
    logger.log(`🔗 Global Prefix: ${config.globalPrefix}`);
  }

  if (config.cors?.enabled) {
    logger.log(
      `🌐 CORS enabled for origins: ${config.cors.origins?.join(', ')}`,
    );
  }

  if (config.swagger?.enabled) {
    logger.log(`📚 Swagger docs available at: /${config.swagger.path}`);
  }

  if (config.rateLimit?.enabled) {
    logger.log(
      `⏱️  Rate limiting: ${config.rateLimit.max} requests per ${config.rateLimit.windowMs}ms`,
    );
  }
}
void bootstrap();
