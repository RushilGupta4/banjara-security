// if (existingUser.attendingDays.includes('3')) {
//   toast.error('User already registered for both days.');
//   setLoading(false);
//   return;
// }

// if (existingUser.attendingDays.includes(attendingDay)) {
//   toast.error('User already registered for the selected day.');
//   setLoading(false);
//   return;
// }

// if (attendingDay === '1' && existingUser.attendingDays.includes('2')) {
//   toast.error('User already registered for Day 2.');
//   setLoading(false);
//   return;
// }

// if (attendingDay === '3' && existingUser.attendingDays.length > 0) {
//   toast.error('User already registered for a day.');
//   setLoading(false);
//   return;
// }

const validateAttendingDays = (attendingDays: string[], attendingDay: string, inOrder: boolean = true) => {
  if (attendingDays.includes('3')) {
    return { success: false, message: 'User already registered for both days.' };
  }

  if (attendingDays.includes(attendingDay)) {
    return { success: false, message: 'User already registered for the selected day.' };
  }

  if (inOrder && attendingDay === '1' && attendingDays.includes('2')) {
    return { success: false, message: 'User already registered for Day 2.' };
  }

  if (attendingDay === '3' && attendingDays.length > 0) {
    return { success: false, message: 'User already registered for a day.' };
  }

  return { success: true, message: '' };
};

export { validateAttendingDays };
