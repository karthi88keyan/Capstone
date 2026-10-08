/** A saved delivery / billing address for a customer. */
export interface Address {
  firstName: string;
  lastName: string;
  /** Full street / flat / building line. */
  addressLine: string;
  email: string;
  city: string;
  /** 6-digit Indian PIN code. */
  pin: string;
  /** 10-digit Indian mobile number. */
  phone: string;
  state: string;
  country: string;
}
