import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const logger = new Logger('Products-Microservice-main');
    // const app = await NestFactory.create(AppModule);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                //port: envs.PORT
                servers: envs.NATS_SERVERS,
            }
        }
    );


    // ✅ APLICAR EL PIPE GLOBALMENTE
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,  // Convierte automáticamente los tipos
            whitelist: true,  // Elimina propiedades no definidas en los DTO
            forbidNonWhitelisted: true, // Lanza error si hay propiedades desconocidas
            transformOptions: {
                enableImplicitConversion: true,  // Convierte sin necesidad de `@Type`
            },
        }),
    );

    await app.listen(/* envs.PORT */);
    logger.log(`products microservices running on http://localhost:${envs.PORT}`);
    console.log(envs.NATS_SERVERS);
}
bootstrap();
