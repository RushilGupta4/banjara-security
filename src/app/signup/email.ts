import { UserType } from '@/types';

const readableAttendingDays = (attendingDays: string[]) => {
  if (attendingDays.includes('3')) {
    return 'Both days';
  }
  if (attendingDays.includes('1') && attendingDays.includes('2')) {
    return 'Day 1 and Day 2';
  }
  if (attendingDays.includes('1')) {
    return 'Day 1';
  }
  if (attendingDays.includes('2')) {
    return 'Day 2';
  }
};

const getEmailHTML = (userData: UserType) => {
  return `
        <h1>Hi ${userData.name},</h1>
        <p>Thanks for registering for Ashoka University's cultural fest, Banjara.</p>
        <p>Here are your registration details:</p>
        <ul>
            <li>UID: ${userData.uid}</li>
            <li>Name: ${userData.name}</li>
            <li>Email: ${userData.email}</li>
            <li>Phone: ${userData.phone}</li>
            <li>College: ${userData.college}</li>
            <li>Attending Days: ${readableAttendingDays(userData.attendingDays)}</li>
        </ul>
        <p>We look forward to seeing you there!</p>
    `;
};

const getEmailText = (userData: UserType) => {
  return `
            Hi ${userData.name},
            Thanks for registering for Ashoka University's cultural fest, Banjara.
            Here are your registration details:
            UID: ${userData.uid}
            Name: ${userData.name}
            Email: ${userData.email}
            Phone: ${userData.phone}
            College: ${userData.college}
            Attending Days: ${readableAttendingDays(userData.attendingDays)}
            We look forward to seeing you there!
        `;
};

export { readableAttendingDays, getEmailHTML, getEmailText };
