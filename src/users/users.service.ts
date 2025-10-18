import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { Notification } from './schema/notificaiton.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(createUserDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async follow(currentUserId: string, targetId: string): Promise<void> {
    if (currentUserId === targetId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetId);
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }
    const targetObjectId = new Types.ObjectId(targetId);
    const currentObjectId = new Types.ObjectId(currentUserId);

    if (currentUser.following.includes(targetObjectId)) {
      throw new BadRequestException('Already following this user');
    }
    currentUser.following.push(targetObjectId);
    targetUser.followers.push(currentObjectId);
    await currentUser.save();
    await targetUser.save();

    const notification = new this.notificationModel({
      recipient: targetId,
      message: `${currentUser.name} started following you.`,
      type: 'follow',
    });
    await notification.save();
  }

  async unfollow(currentUserId: string, targetId: string): Promise<void> {
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetId);

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }
    const targetIdStr = targetId.toString();
    const currentIdStr = currentUserId.toString();

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetIdStr,
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentIdStr,
    );

    await currentUser.save();
    await targetUser.save();
  }

  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<User[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'name email');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const skip = (page - 1) * limit;
    return user.followers.slice(skip, skip + limit) as unknown as User[];
  }

  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<User[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'name email');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const skip = (page - 1) * limit;
    return user.following.slice(skip, skip + limit) as unknown as User[];
  }

  // async getMutualFriends(userId: string): Promise<User[]> {
  //   const user = await this.userModel
  //     .findById(userId)
  //     .populate('followers following', 'name email');
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  // const mutuals = user.followers.filter((follower) =>
  //   user.following.some((following) => following._id.equals(follower._id)),
  // );
  //   return mutuals as unknown as User[];
  // }
  async getMutualFriends(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<User[]> {
    const user = await this.userModel
      .findById(id)
      .populate('followers following');
    if (!user) throw new Error('User not found');
    const mutuals = user.followers.filter((follower) =>
      user.following.some((following) => following._id.equals(follower._id)),
    );
    const skip = (page - 1) * limit;
    return mutuals.slice(skip, skip + limit) as unknown as User[];
  }
  async findByEmail(email: string): Promise<User> {
    // const user = await this.userModel.findOne({ email });
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userModel.findById(id).exec();
  }
}
