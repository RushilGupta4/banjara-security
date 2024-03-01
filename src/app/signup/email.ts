import { UserType } from '@/types';

export const getEmailHTML = (userData: UserType) => {
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
        </ul>
        <p>We look forward to seeing you there!</p>
    `;
};

export const getEmailText = (userData: UserType) => {
  return `
            Hi ${userData.name},
            Thanks for registering for Ashoka University's cultural fest, Banjara.
            Here are your registration details:
            UID: ${userData.uid}
            Name: ${userData.name}
            Email: ${userData.email}
            Phone: ${userData.phone}
            College: ${userData.college}
            We look forward to seeing you there!
        `;
};
