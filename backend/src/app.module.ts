import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PruebaModule } from './prueba/prueba.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserRoleModule } from './user-role/user-role.module';
import { EstadosRegistroModule } from './estados-registro/estados-registro.module';
import { TiposBecasModule } from './tipos-becas/tipos-becas.module';
import { EstadosConvocatoriasModule } from './estados-convocatorias/estados-convocatorias.module';
import { ConvocatoriasModule } from './convocatorias/convocatorias.module';
import { PersonasModule } from './personas/personas.module';
import { NivelesAcademicosModule } from './niveles-academicos/niveles-academicos.module';
import { EstadosSolicitudesModule } from './estados-solicitudes/estados-solicitudes.module';
import { ComitesModule } from './comites/comites.module';
import { ComitesMiembrosModule } from './comites-miembros/comites-miembros.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    PruebaModule,
    AuthModule,
    UserModule,
    RolesModule,
    UserRoleModule,
    EstadosRegistroModule,
    TiposBecasModule,
    EstadosConvocatoriasModule,
    ConvocatoriasModule,
    PersonasModule,
    NivelesAcademicosModule,
    EstadosSolicitudesModule,
    ComitesModule,
    ComitesMiembrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}