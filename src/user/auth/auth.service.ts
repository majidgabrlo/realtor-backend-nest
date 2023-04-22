import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from 'prisma/prisma-client';

type SignupParams = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

type SigninParams = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(
    { email, password, name, phone }: SignupParams,
    userType: UserType,
  ) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new HttpException('Email is already taken', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    return await this.generateJWT({ id: user.id, name: user.name });
  }

  async signIn({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }
    return await this.generateJWT({ id: user.id, name: user.name });
  }

  private async generateJWT({ id, name }: { name: string; id: number }) {
    const token = await jwt.sign({ name, id }, process.env.JSON_TOKEN_KEY, {
      expiresIn: 3600000,
    });
    return token;
  }

  generateProductKey({
    email,
    userType,
  }: {
    email: string;
    userType: UserType;
  }) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }
}
