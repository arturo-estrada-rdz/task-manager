/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import connectDB from './database-connection';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mongoose.connect with the correct URI and log success message', async () => {
    const mockConnection = { connection: { host: 'mockhost' } };
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockConnection);

    console.info = jest.fn();
    console.log = jest.fn();
    (process as any).exit = jest.fn();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(console.info).toHaveBeenCalledWith('Connecting');
    expect(console.log).toHaveBeenCalledWith('MongoDB Connected: mockhost');
    expect(process.exit).not.toHaveBeenCalled();
  });

  it('should log error message and exit process on failure', async () => {
    const mockError = new Error('Mock connection error');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(mockError);

    console.error = jest.fn();
    (process as any).exit = jest.fn();

    await connectDB();

    expect(console.error).toHaveBeenCalledWith(`Error: ${mockError.message}`);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
