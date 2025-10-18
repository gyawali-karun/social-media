import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth,guard';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Req() req: any, @Param('id') id: string) {
    console.log(req?.user);
    return this.usersService.follow(req.user.sub.toString(), id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unfollow')
  async unfollow(@Req() req: any, @Param('id') id: string) {
    return this.usersService.unfollow(req.user.sub.toString(), id);
  }

  @Get(':id/followers')
  async getFollowers(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getFollowers(id, page, limit);
  }

  @Get(':id/following')
  async getFollowing(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getFollowing(id, page, limit);
  }

  @Get(':id/mutual-friends')
  async getMutualFriends(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getMutualFriends(id, page, limit);
  }
}
