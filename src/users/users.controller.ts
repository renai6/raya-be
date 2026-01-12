import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Put(':id/cash-sessions')
  updateCashSessions(
    @Body() body: { closingCash: number },
    @Param('id') id: string,
  ) {
    return this.usersService.updateCashSessions(id, body.closingCash);
  }

  @Get(':userId/cash-sessions')
  getCashSessions(@Param('userId') userId: string) {
    return this.usersService.getCashSessions(userId);
  }

  @Get(':id/cash-session')
  getCashSessionsById(@Param('id') id: string) {
    return this.usersService.getCashSessionsById(id);
  }

  @Post(':userId/cash-sessions')
  createCashSessions(
    @Body() body: { openingCash: number },
    @Param('userId') userId: string,
  ) {
    return this.usersService.createCashSessions(userId, body.openingCash);
  }
}
