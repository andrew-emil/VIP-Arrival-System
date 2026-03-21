import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN,)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ─── Create user ─────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const adminName: string = session['userName'] ?? session['userId'];
    return this.usersService.create(createUserDto, adminName);
  }

  // ─── List all users ───────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAllUsers() {
    return this.usersService.findAll();
  }

  // ─── Get single user ──────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOneUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ─── Update user ──────────────────────────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({ summary: 'Update user name, role, or active status (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ─── Assign permissions ───────────────────────────────────────────────────────
  // @Post(':id/permissions')
  // @HttpCode(200)
  // @ApiOperation({ summary: 'Assign permissions to a user (admin only)' })
  // @ApiParam({ name: 'id', description: 'User UUID' })
  // @ApiBody({ schema: { example: { permissions: ['VIEW_REPORTS', 'MANAGE_VIPS'] } } })
  // @ApiResponse({ status: 200, description: 'Permissions assigned' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // assignPermissions(
  //   @Param('id') id: string,
  //   @Body('permissions') permissions: string[],
  //   @Session() session: Record<string, any>,
  // ) {
  //   const adminName: string = session['userName'] ?? session['userId'];
  //   return this.usersService.assignPermissions(id, permissions, adminName);
  // }

  // ─── Delete user ──────────────────────────────────────────────────────────────

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
