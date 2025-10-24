import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users/users.service';
import { RouterLink } from "@angular/router";
import { LoaderComponent } from '../../shared/loader/loader.component';
import { User } from '../../core/models/user.interface';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterLink, LoaderComponent, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  private readonly usersService = inject(UsersService);

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  error: string | null = null;

  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = res; // Initialize filtered users
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = this.getErrorMessage(error);
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Users not found. Please try again later.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else if (error.status === 0) {
      return 'Network error. Please check your internet connection.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  retry(): void {
    this.error = null;
    this.ngOnInit();
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }
}
