export interface BodyResponse<T> {
  message: string;
  data?: T;
  error: boolean;
}

export interface UserData {
  _id?: string;
  firebaseUid?: string;
  email: string;
  firstName: string;
  lastName: string;
  favoriteCharacters?: string[];
}

export interface Characters {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}
