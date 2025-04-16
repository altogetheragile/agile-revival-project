
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'editor';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export type UserFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'pending';
};
