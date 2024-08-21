import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SECURITY - https://docs.nestjs.com/security/helmet#helmet
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Include credentials like cookies in requests
  });

  // API SPEC - https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
    .setTitle('Tale Compendium API')
    .setDescription('API documentation for the Tale Compendium application')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: false,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  SwaggerModule.setup('api/docs', app, document, options);

  await app.listen(5000); // Ensure it's listening on the correct port
}
bootstrap();
