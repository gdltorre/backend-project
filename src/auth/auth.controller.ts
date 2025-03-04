import {Controller, Post, Body, UseGuards, Request, Get, Param, HttpCode, HttpStatus, NotFoundException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {JwtAuthGuard} from "./jwt-auth.guard";
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() registerDto: any) {
        return this.authService.register(registerDto);
    }

    @Get('users/:id')
    async getUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(+id);
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
      }

    // Get all users
    @Get('users')
    @UseGuards(JwtAuthGuard)
    async getUsers() {
        return this.usersService.findAll();
    }
}