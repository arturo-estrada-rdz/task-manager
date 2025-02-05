export function autoBindMethods(instance: unknown) {
  const proto = Object.getPrototypeOf(instance);

  for (const key of Object.getOwnPropertyNames(proto)) {
    const value = proto[key];

    if (key !== 'constructor' && typeof value === 'function') {
      instance[key] = value.bind(instance);
    }
  }
}
