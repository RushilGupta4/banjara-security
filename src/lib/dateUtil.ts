const days: { [key: string]: number } = {
  '2024-04-05': 1,
  '2024-04-06': 2,
};

const getCurrentDayInt = () => {
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split('T')[0];

  console.log(dateString);

  return days[dateString];
};

export { getCurrentDayInt };
