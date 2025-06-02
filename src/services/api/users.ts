
import { User } from '@/types/user';
import { mockUsers } from './mock-data';

class UserService {
  private users: User[] = [...mockUsers];

  async getAll(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.users;
  }

  async getById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.find(user => user.id === id) || null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updates
    };
    
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    this.users.splice(index, 1);
  }

  async toggleStatus(id: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    this.users[index].isActive = !this.users[index].isActive;
    return this.users[index];
  }
}

export const userApi = new UserService();
