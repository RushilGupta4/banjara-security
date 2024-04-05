const days: { [key: string]: number } = {
  '2024-04-06': 1,
  '2024-04-07': 2,
};

const getCurrentDayInt = () => {
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split('T')[0];

  console.log(dateString);

  return days[dateString];
};

export { getCurrentDayInt };
