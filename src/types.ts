type UserType = {
  uid: string;
  name: string;
  college: string;
  email: string;
  phone: string;
  gateStatus: boolean;
  registered: boolean;
  competitions: string[];
  attendingDays: string[];
};

type Replacement = {
  oldUserID: string;
  newUserID: string;
};

export type { UserType, Replacement };
