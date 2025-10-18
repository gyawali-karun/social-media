import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    return user;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.validateUser(email, password);

    const payload = { email: user?.email, sub: user?._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
