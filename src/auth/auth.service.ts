import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  getCookieOptions,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from './auth.utils';
import * as bcrypt from 'bcrypt';
import { ENV_KEYS } from '../config/env.keys';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createAuthDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = this.userRepo.create({
      ...createAuthDto,
      password: hashedPassword,
      emailToken: '',
    });

    const savedUser = await this.userRepo.save(user);

    const emailToken = await this.jwtService.signAsync(
      { sub: savedUser.id },
      {
        secret: this.configService.get<string>(ENV_KEYS.JWT_EMAIL_SECRET),
        expiresIn: this.configService.get<string>(
          ENV_KEYS.JWT_EMAIL_EXPIRATION,
        ) as unknown as number,
      },
    );

    savedUser.emailToken = emailToken;
    await this.userRepo.save(savedUser);

    return {
      message: 'Registration successful',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        emailToken: savedUser.emailToken,
      },
    };
  }

  async findUserById(userId: number) {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  async getTokens(userId: number, email: string, name: string) {
    const payload = { sub: userId, email, name };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        expiresIn: this.configService.get<string>(
          ENV_KEYS.JWT_ACCESS_EXPIRATION,
        ) as unknown as number,
      }),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get<string>(ENV_KEYS.JWT_REFRESH_SECRET),
          expiresIn: this.configService.get<string>(
            ENV_KEYS.JWT_REFRESH_EXPIRATION,
          ) as unknown as number,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(
      ACCESS_COOKIE_NAME,
      accessToken,
      getCookieOptions('access', this.configService),
    );
    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getCookieOptions('refresh', this.configService),
    );
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.userRepo.findOne({
      where: {
        email: loginDto.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        emailToken: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.name);
    this.setCookies(response, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailToken: user.emailToken,
      },
    };
  }

  logout(response: Response) {
    response.clearCookie(
      ACCESS_COOKIE_NAME,
      getCookieOptions('access', this.configService),
    );
    response.clearCookie(
      REFRESH_COOKIE_NAME,
      getCookieOptions('refresh', this.configService),
    );
    return {
      message: 'Logout successful',
    };
  }
}
