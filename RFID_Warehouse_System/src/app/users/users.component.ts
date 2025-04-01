import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  key: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = { username: '', email: '', role: 'user', key: ''};
  showForm = false;
  isEditing = false;
  editingUserId: string | null = null;
  loginService= inject(LoginService);
  router = inject(Router)
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.users$.subscribe(users => (this.users = users));
    this.userService.loadUsers();
  }

  addUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      alert('Please fill all required fields!');
      return;
    }
  
    const userData = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      role: this.newUser.role || 'user',
      key: this.newUser.key || ''
    };
  
    this.userService.createUser(userData).subscribe({
      next: (createdUser) => {
        this.resetForm();
        this.router.navigate(['/Main'])
      },
      error: (err) => {
        alert(`Error: ${err.error?.message || err.message}`);
      }
    });
  }

  editUser(user: User) {
    this.newUser = { ...user };
    this.isEditing = true;
    this.editingUserId = user._id;
    this.showForm = true;
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
        },
        error: (err) => {
          alert('Failed to delete user');
        }
      });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingUserId = null;
    this.newUser = { username: '', email: '', role: 'user',key: '' };
    this.showForm = false;
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/master-login']);
  }
}