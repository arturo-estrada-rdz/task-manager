import { Types } from 'mongoose';
import Task from './task';
import { TaskRepository } from './task.repository.impl';
import { TaskInput } from './task.types';

jest.mock('./task');

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository();
    jest.clearAllMocks();
  });

  it('should find all tasks for a user', async () => {
    const userId = new Types.ObjectId().toString();
    const mockTasks = [
      { _id: '1', user: userId, title: 'Task 1' },
      { _id: '2', user: userId, title: 'Task 2' },
    ];

    (Task.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTasks),
    });

    const tasks = await taskRepository.findAll(userId);

    expect(Task.find).toHaveBeenCalledWith({
      user: new Types.ObjectId(userId),
    });
    expect(tasks).toEqual(mockTasks);
  });

  it('should find a task by ID and user', async () => {
    const mockTask = { _id: '1', user: 'userId', title: 'Task 1' };

    (Task.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTask),
    });

    const task = await taskRepository.findById('1', 'userId');

    expect(Task.findOne).toHaveBeenCalledWith({ _id: '1', user: 'userId' });
    expect(task).toEqual(mockTask);
  });

  it('should create a new task', async () => {
    const taskInput = { user: 'userId', title: 'New Task' };
    const mockTask = { _id: '1', ...taskInput };
    Task.prototype.save.mockResolvedValueOnce(mockTask);

    const task = await taskRepository.create(taskInput as unknown as TaskInput);

    expect(Task.prototype.save).toHaveBeenCalled();
    expect(task).toEqual(mockTask);
  });

  it('should update an existing task', async () => {
    const taskUpdates = { title: 'Updated Task' };
    const mockUpdatedTask = { _id: '1', user: 'userId', title: 'Updated Task' };

    (Task.findOneAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUpdatedTask),
    });

    const task = await taskRepository.update('1', 'userId', taskUpdates);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1', user: 'userId' },
      taskUpdates,
      { new: true }
    );
    expect(task).toEqual(mockUpdatedTask);
  });

  it('should update a specific field of a task', async () => {
    const keyValuePair = { key: 'completed', value: true };
    const mockUpdatedTask = { _id: '1', user: 'userId', completed: true };

    (Task.findOneAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUpdatedTask),
    });

    const task = await taskRepository.updateField('1', 'userId', keyValuePair);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1', user: 'userId' },
      keyValuePair,
      { new: true }
    );
    expect(task).toEqual(mockUpdatedTask);
  });

  it('should delete a task', async () => {
    const mockTask = { _id: '1', user: 'userId', title: 'Task 1' };

    (Task.findOneAndDelete as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTask),
    });

    const task = await taskRepository.delete('1', 'userId');

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: '1',
      user: 'userId',
    });
    expect(task).toEqual(mockTask);
  });
});
