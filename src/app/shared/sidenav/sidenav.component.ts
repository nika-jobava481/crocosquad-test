import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  routerLink: string;
  icon?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Users',
    routerLink: '/users',
    icon: 'icon-users1'
  },
  {
    label: 'Posts',
    routerLink: '/posts',
    icon: 'icon-list1'
  },
  {
    label: 'Promotions',
    routerLink: '/promotions',
    icon: 'icon-target'
  }
];

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  public menuItems = MENU_ITEMS;
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Input() isMobileClosing = false;
  @Output() mobileMenuClose = new EventEmitter<void>();

  closeMobileMenu() {
    this.mobileMenuClose.emit();
  }
}
