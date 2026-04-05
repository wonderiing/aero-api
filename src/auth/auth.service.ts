import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { UUID } from 'node:crypto';
import { ref } from 'node:process';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }


  async register(registerDto: RegisterDto) {

    const exists = await this.userRepo.findOneBy({ email: registerDto.email });

    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepo.create({
      ...registerDto,
      passwordHash
    });

    await this.userRepo.save(user);

  }

  async login(loginDto: LoginDto) {

    const user = await this.userRepo.findOneBy({ email: loginDto.email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const validate = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!validate) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id, user.email);
  }

  async refreshTokens(userId: string, refreshToken: string) {

    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user?.hashedRefreshToken) throw new ForbiddenException();

    const match = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!match) throw new ForbiddenException('Refresh token not valid')

    return this.generateTokens(user.id, user.email);

  }

  async logout(userId: string) {
    await this.userRepo.update(userId, { hashedRefreshToken: null });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { id: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      })
    ])

    await this.saveRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    await this.userRepo.update(userId, { hashedRefreshToken: hashedToken });
  }

}
