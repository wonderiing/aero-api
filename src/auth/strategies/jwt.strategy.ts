import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        @InjectRepository(User) 
        private readonly repo: Repository<User>,
        private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') as string,
        });
    }

    async validate(payload: { id: string; email: string }): Promise<User> {

        const user = await this.repo.findOneBy({id: payload.id});

        if (!user) throw new NotFoundException('Invalid Token')

        return user;
    }
}
