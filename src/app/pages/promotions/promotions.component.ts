import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelComponent } from './wheel/wheel.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@Component({
  selector: 'app-promotions',
  imports: [CommonModule, WheelComponent, LeaderboardComponent],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent {

}
