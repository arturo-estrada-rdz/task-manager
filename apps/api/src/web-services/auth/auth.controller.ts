import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { autoBindMethods } from '../../utils';
import { IUserRepository } from './user.repository';
import { UserRepository } from './user.repository.impl';

export class AuthController {
  constructor(private userRepository: IUserRepository = new UserRepository()) {
    autoBindMethods(this);
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { username, password, fullname } = req.body;

      const user = await this.userRepository.create({
        username,
        password,
        fullname,
      });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string
      );

      return res.json({ token });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await this.userRepository.findByEmail(username);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string
      );

      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const authController = new AuthController();
