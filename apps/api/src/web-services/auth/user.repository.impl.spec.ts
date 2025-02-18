import User from './user';
import { UserRepository } from './user.repository.impl';
import { UserInput } from './user.types';

jest.mock('./user'); // Mock the User model

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  it('should find all users', async () => {
    const mockUsers = [
      { _id: '1', username: 'user1', password: 'pass1', fullname: 'User One' },
    ];
    (User.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUsers),
    });

    const users = await userRepository.findAll();

    expect(User.find).toHaveBeenCalled();
    expect(users).toEqual(mockUsers);
  });

  it('should find user by ID', async () => {
    const mockUser = {
      _id: '1',
      username: 'user1',
      password: 'pass1',
      fullname: 'User One',
    };
    (User.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const user = await userRepository.findById('1');

    expect(User.findById).toHaveBeenCalledWith('1');
    expect(user).toEqual(mockUser);
  });

  it('should find user by email', async () => {
    const mockUser = {
      _id: '1',
      username: 'user1',
      password: 'pass1',
      fullname: 'User One',
    };
    (User.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const user = await userRepository.findByEmail('user1');

    expect(User.findOne).toHaveBeenCalledWith({ username: 'user1' });
    expect(user).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const userInput: UserInput = {
      username: 'newuser',
      password: 'newpass',
      fullname: 'New User',
    };
    const mockUser = { _id: '2', ...userInput };
    (User.prototype.save as jest.Mock).mockResolvedValueOnce(mockUser);

    const user = await userRepository.create(userInput);

    expect(User.prototype.save).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  it('should update an existing user', async () => {
    const userInput: UserInput = {
      username: 'updateduser',
      password: 'updatedpass',
      fullname: 'Updated User',
    };
    const mockUpdatedUser = { _id: '1', ...userInput };
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUpdatedUser),
    });

    const user = await userRepository.update('1', userInput);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('1', userInput);
    expect(user).toEqual(mockUpdatedUser);
  });

  it('should delete a user', async () => {
    const mockUser = {
      _id: '1',
      username: 'user1',
      password: 'pass1',
      fullname: 'User One',
    };
    (User.findByIdAndDelete as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const user = await userRepository.delete('1');

    expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(user).toEqual(mockUser);
  });
});
