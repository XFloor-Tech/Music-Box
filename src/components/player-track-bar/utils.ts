const progressFromRawValue = (raw: number, divider: string = ':') => {
  const value = Math.ceil(raw);
  console.log('raw', raw);
  console.log('value', value);
  return `${Math.trunc(value / 60)}${divider[0]}${('00' + (value % 60)).slice(-2)}`;
};

export { progressFromRawValue };
