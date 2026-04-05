import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(private configService: ConfigService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: { id: string; email: string }) {
        const refreshToken = req.headers['authorization']?.split(' ')[1];
        return { ...payload, refreshToken };
    }

}