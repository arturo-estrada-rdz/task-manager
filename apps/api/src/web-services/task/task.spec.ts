import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Task from './task';

describe('Task Model', () => {
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
  });

  it('should create a task successfully', async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      title: 'Test Task',
      description: 'This is a test description',
      dueDate: new Date(),
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.completed).toBe(false);
  });

  it('should require the user field', async () => {
    const taskData = {
      title: 'Test Task',
    };

    const task = new Task(taskData);
    let error;

    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty('user');
  });

  it('should require the title field', async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
    };

    const task = new Task(taskData);
    let error: { errors: unknown };

    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty('title');
  });
});
