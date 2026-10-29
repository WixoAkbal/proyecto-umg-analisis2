import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { EstadosRegistroService } from 'src/estados-registro/estados-registro.service';
import { CreatePersonaDto } from 'src/personas/dto/create-persona.dto';
import { PersonasService } from 'src/personas/personas.service';
import { RolesService } from 'src/roles/roles.service';
import { UserRoleService } from 'src/user-role/user-role.service';
import { Repository } from 'typeorm';
import { PasswordDto } from './dto/password.dto';
import { UserPartialDto } from './dto/user-partial.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(User) 
        private readonly _userRepository: Repository<User>,
        private readonly _roleService: RolesService,
        private readonly _statusService: EstadosRegistroService,
        private readonly _userRoleService: UserRoleService,
        private readonly _personaService: PersonasService
       ) { }

    async loadUserByUsername(username: String): Promise<User | undefined> {
        const user = await this._userRepository.findOne({
            where: { correoElectronico: username },
            relations: {
                roles: { rol: true }
            }
        });

        if (!user) {
            throw new NotFoundException('El usuario no se encuentra registrado.');
        }

        return user;
    }

    async findAll() {
        return this._userRepository.find({
            order:{
                id: 'DESC'
            },
            relations: {
                estado: true
            }
        }); 
    }

    async findById(id: number) {
        const user = await this._userRepository.findOne({
            where: { id: id, estado: true},
            relations: {
                roles: { rol: true },
                estado: true
            }
        });

        if (!user) {
            throw new NotFoundException('No se ha encontrado al usuario.');
        }

        return user;
    }

    async findByEmail(email: String) {
        const user = await this._userRepository.findOne({
            where: { correoElectronico: email }
        });

        if (user) {
            return user;
        }
    }

    async create(userDto: UserDto, subId: number) {
        const bEncryptPasswordEncoder = 12;

        const user = await this._userRepository.findOne({
            where: { correoElectronico: userDto.correoElectronico }
        });

        if (user) {
            throw new ConflictException('Ya existe un usuario registrado con el correo electrónico.');
        }

        const role = await this._roleService.findOne(userDto.rolId);
        const status = await this._statusService.findOne(userDto.estadoId);

        const hashedPassword = await bcrypt.hash(
            userDto.contrasenia,
            bEncryptPasswordEncoder,
        );

        const newUser = this._userRepository.create({
            ...userDto,
            contrasenia: hashedPassword,
            estado: status,
            creadoPor: subId
        });
        
        try {
            const userCreated = await this._userRepository.save(newUser);
            await this._userRoleService.create(userCreated, role, status, subId);   
            
            return new ApiResponseDto(HttpStatus.OK, 'Se ha creado al usuario con éxito.');
        } catch (error) {
            throw new InternalServerErrorException('Ha ocurrido un error al intentar guardar al usuario.');
        }
    }

    async update(id: number, userDto: UserPartialDto, subId: number) {
        const user = await this.findById(id);
        const userEmail = await this.findByEmail(userDto.correoElectronico!!);

        if (userEmail && userEmail.id !== id) {
            throw new ConflictException('Ya existe un usuario registrado con el correo electrónico.');
        }

        let role;
        if (userDto.rolId) {
            role = await this._roleService.findOne(userDto.rolId);
        }

        let status;
        if (userDto.estadoId) {
            status = await this._statusService.findOne(userDto.estadoId);
        }

        Object.assign(user, {
            ...userDto,
            ...(status && { estado: status }),
            modificadoPor: subId,
            estadoAnterior: user.estado
        });

        const userUpdated = await this._userRepository.save(user);

        if (role) {
            await this._userRoleService.update(userUpdated.roles[0], role, subId);
        }

        return new ApiResponseDto(HttpStatus.OK, 'Se ha modificado al usuario con éxito.');
    }

    async remove(id: number, subId: number) {
        const user = await this.findById(id);
        const status = await this._statusService.findOne(3);

        Object.assign(user, {
            ...(status && { estado: status }),
            modificadoPor: subId,
            estadoAnterior: user.estado
        });

        await this._userRepository.save(user);

        return new ApiResponseDto(HttpStatus.OK, 'Se ha eliminado al usuario con éxito.');
    }

    async changePassword(id: number, passwordDto: PasswordDto, subId: number) {
        const bEncryptPasswordEncoder = 12;
        const user = await this.findById(id);

        const validatePassword = await bcrypt.compare(
            passwordDto.contraseniaActual,
            user!!.contrasenia,
        );

        if (!validatePassword) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const hashedPassword = await bcrypt.hash(
            passwordDto.contraseniaNueva,
            bEncryptPasswordEncoder,
        );
        
        Object.assign(user, {
            contrasenia: hashedPassword,
            modificadoPor: subId,
            estadoAnterior: user.estado
        });

        await this._userRepository.save(user);

        return new ApiResponseDto(HttpStatus.OK, 'Contraseña cambiada con éxito.');
    }

    async userRegister(userRegisterDto: UserRegisterDto, subId: number) {
        const bEncryptPasswordEncoder = 12;

        const user = await this._userRepository.findOne({
            where: { correoElectronico: userRegisterDto.correoElectronico }
        });

        if (user) {
            throw new ConflictException('Ya existe un usuario registrado con el correo electrónico.');
        }

        const role = await this._roleService.findOne(userRegisterDto.rolId);
        const status = await this._statusService.findOne(userRegisterDto.estadoId);

        const hashedPassword = await bcrypt.hash(
            userRegisterDto.contrasenia,
            bEncryptPasswordEncoder,
        );

        const newUser = this._userRepository.create({
            ...userRegisterDto,
            contrasenia: hashedPassword,
            estado: status,
            creadoPor: subId
        });
        
        try {
            const userCreated = await this._userRepository.save(newUser);
            await this._userRoleService.create(userCreated, role, status, subId);   

            if (userCreated !== null) {
                let nuevaPersona = new CreatePersonaDto();
                nuevaPersona.primerNombre = userRegisterDto.nombre;
                nuevaPersona.primerApellido = userRegisterDto.apellido;
                nuevaPersona.dpi = "0";
                nuevaPersona.nivelAcademicoId = userRegisterDto.nivelAcademico;
                nuevaPersona.institucionEducativa = userRegisterDto.institucionEducativa;
                nuevaPersona.genero = userRegisterDto.genero;
                nuevaPersona.fechaNacimiento = userRegisterDto.fechaNacimiento;
                nuevaPersona.usuarioId = userCreated.id;
        
                await this._personaService.create(nuevaPersona, subId);
            }
            
            return new ApiResponseDto(HttpStatus.OK, 'Se ha creado al usuario con éxito.');
        } catch (error) {
            throw new InternalServerErrorException('Ha ocurrido un error al intentar guardar al usuario.' + error);
        }
    }
}
