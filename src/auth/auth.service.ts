import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      this.logger.debug('User validation successful');
      return result;
    }
    this.logger.debug('User validation failed');
    return null;
  }

  async login(user: any) {
    this.logger.debug(`Generating JWT token for user: ${user.username}`);
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated token: ${token}`);
    return {
      access_token: token,
    };
  }

  async register(registerDto: any) {
    this.logger.debug(`Registering new user: ${registerDto.username}`);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.login(user);
  }
}