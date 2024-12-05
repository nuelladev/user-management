import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from './user.entity'; // Ensure the User entity is imported
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint to get all users
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUsersById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() user: Partial<User>,
  ): Promise<User> {
    return this.userService.update(id, user);
  }

  @Post()
  createUser(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }
}
