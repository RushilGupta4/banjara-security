const days: { [key: string]: number } = {
  '2024-04-06': 1,
  '2024-04-07': 2,
};

const getCurrentDayInt = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const dateString = new Date(Date.now() - tzoffset).toISOString().split('T')[0];
  console.log(dateString);

  return days[dateString];
};

export { getCurrentDayInt };
