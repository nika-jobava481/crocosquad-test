import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentDateTime = new Date();
  private timeInterval: any;
  
  @Output() sidebarToggle = new EventEmitter<void>();

  ngOnInit() {
    this.updateDateTime();
    // Update every second
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  private updateDateTime() {
    this.currentDateTime = new Date();
  }
}
