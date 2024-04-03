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
  timestamps: { [key: string]: string }[];
  team?: string;
  paymentDay1: boolean;
  paymentDay2: boolean;
  repeatedNumber: boolean;
};

type Replacement = {
  oldUserID: string;
  newUserID: string;
};

export type { UserType, Replacement };
