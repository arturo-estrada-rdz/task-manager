import { autoBindMethods } from './auto-bind';

class TestClass {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  setName(newName: string): void {
    this.name = newName;
  }
}

describe('autoBindMethods', () => {
  it('should bind class methods to instance', () => {
    const instance = new TestClass('initial');
    autoBindMethods(instance);

    const { getName, setName } = instance;

    expect(getName()).toBe('initial');
    setName('newName');
    expect(getName()).toBe('newName');
  });

  it('should not bind constructor', () => {
    const instance = new TestClass('initial');
    autoBindMethods(instance);

    expect(instance.constructor).toBe(TestClass);
  });
});
