import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Auth API')
      .setDescription('Stage 5 — JWT, refresh tokens, RBAC')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
