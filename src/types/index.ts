export interface BodyResponse<T> {
  message: string;
  data?: T;
  error: boolean;
}

export interface UserData {
  firebaseUid?: string;
  email: string;
  firstName: string;
  lastName: string;
}
