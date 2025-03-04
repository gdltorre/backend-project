"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService) {
        Object.defineProperty(this, "usersService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: usersService
        });
        Object.defineProperty(this, "jwtService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jwtService
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new common_1.Logger(AuthService_1.name)
        });
    }
    async validateUser(username, pass) {
        this.logger.debug(`Attempting to validate user: ${username}`);
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            this.logger.debug('User validation successful');
            return result;
        }
        this.logger.debug('User validation failed');
        return null;
    }
    async login(user) {
        this.logger.debug(`Generating JWT token for user: ${user.username}`);
        const payload = { username: user.username, sub: user.id };
        const token = this.jwtService.sign(payload);
        this.logger.debug(`Generated token: ${token}`);
        return {
            access_token: token,
        };
    }
    async register(registerDto) {
        this.logger.debug(`Registering new user: ${registerDto.username}`);
        if (!registerDto.username || !registerDto.password || !registerDto.name || !registerDto.email) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create(Object.assign(Object.assign({}, registerDto), { password: hashedPassword }));
        return this.login(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map