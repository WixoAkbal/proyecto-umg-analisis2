import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosRegistroModule } from 'src/estados-registro/estados-registro.module';
import { PersonasModule } from 'src/personas/personas.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    EstadosRegistroModule,
    UserRoleModule,
    PersonasModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
