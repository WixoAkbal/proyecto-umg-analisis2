import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { EstadosRegistroModule } from 'src/estados-registro/estados-registro.module';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    EstadosRegistroModule,
    UserRoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
