import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/configuration';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LocusModule } from './locus/locus.module';
import { JwtModule } from '@nestjs/jwt';
import { RncLocus } from 'src/entities/rnc-locus.entity';
import { RncLocusMember } from 'src/entities/rnc-locus-member.entity';
import { SnakeNamingStrategy } from 'src/typeorm/snake-naming.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.host') as string,
        port: configService.get('db.port') as number,
        username: configService.get('db.username') as string,
        password: configService.get('db.password') as string,
        database: configService.get('db.database') as string,
        entities: [RncLocus, RncLocusMember],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        extra: {
          statement_timeout: 30000,
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LocusModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
