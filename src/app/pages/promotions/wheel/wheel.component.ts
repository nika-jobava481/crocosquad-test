import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wheel',
  imports: [FormsModule],
  templateUrl: './wheel.component.html',
  styleUrl: './wheel.component.scss'
})
export class WheelComponent {

  currentAngle = 7;
  sector = 1;
  lastSector = 1;
  errorMessage = '';

  onKeyDown(event: KeyboardEvent) {
    // Prevent 'e', 'E', '+', '-' from being typed
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  spinWheel() {
    // Validate sector input
    if (this.sector < 1 || this.sector > 10) {
      this.errorMessage = 'Sector not found.';
      return;
    }
    
    // Clear error message if valid
    this.errorMessage = '';
    
    let randomTurns = Math.floor(Math.random() * 3) + 3;
    this.currentAngle -= 360 * randomTurns + (36 * (this.sector - this.lastSector));
    this.lastSector = this.sector;
  }

}
