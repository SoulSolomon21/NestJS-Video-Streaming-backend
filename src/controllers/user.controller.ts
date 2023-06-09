/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    UploadedFiles,
    Put,
    Req,
    Res,
    Post,
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    @Post('/signup')
    async SignUp(@Res() response, @Body() user: User) {
        const newUser = await this.userService.signup(user)
        return response.status(HttpStatus.CREATED).json({
            newUser
        })
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const token = await this.userService.signin(user, this.jwtService)
        return response.status(HttpStatus.OK).json(token)
    }
}