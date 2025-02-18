import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from './user';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
});

describe('User Model', () => {
  it('should hash the password before saving the user', async () => {
    const user = new User({
      username: 'testuser',
      password: 'plaintextpassword',
      fullname: 'Test User',
    });

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');

    const savedUser = await user.save();

    expect(bcrypt.hash).toHaveBeenCalledWith('plaintextpassword', 10);
    expect(savedUser.password).toBe('hashedpassword');
  });

  it('should not hash the password if it is not modified', async () => {
    const existingUser = new User({
      username: 'existinguser',
      password: 'existinghashedpassword',
      fullname: 'Existing User',
    });

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('existinghashedpassword');

    await existingUser.save();

    existingUser.fullname = 'Updated Name';
    await existingUser.save();

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it('should correctly compare passwords', async () => {
    const user = new User({
      username: 'testuser',
      password: 'hashedpassword',
      fullname: 'Test User',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const isMatch = await user.comparePassword('plaintextpassword');

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'plaintextpassword',
      'hashedpassword'
    );
    expect(isMatch).toBe(true);
  });
});
