import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const emailTaken = await this.isEmailTaken(user.email);
    if (emailTaken) {
      throw new ConflictException('Email already in use by another user');
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    if (user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'Cannot update. Email already in use by another user',
        );
      }
    }

    await this.userRepository.save({ id, ...user });
    return this.findOne(id);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOneBy({ email });
    return !!existingUser;
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
