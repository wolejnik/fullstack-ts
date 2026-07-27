import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [ProductsModule, AuthModule, UsersModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(middleware: MiddlewareConsumer) {
    middleware
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
