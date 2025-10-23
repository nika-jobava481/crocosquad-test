import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'croco-test-ng';
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobileMenuClosing = false;

  toggleSidebar() {
    // Check if we're on mobile
    if (window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuClosing = true;
      this.isMobileMenuOpen = false;
      
      // Reset closing state after animation completes
      setTimeout(() => {
        this.isMobileMenuClosing = false;
      }, 400);
    }
  }
}
