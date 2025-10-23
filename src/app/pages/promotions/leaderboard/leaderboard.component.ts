import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type WeekType = "I" | "II" | "III" | "IV";

interface LeaderboardEntry {
  customerId: number;
  loginName: string;
  place: number;
  week: WeekType;
}

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  
  // Leaderboard properties
  weekTypes: WeekType[] = ['I', 'II', 'III', 'IV'];
  activeFilter: WeekType | 'ALL' = 'ALL';
  leaderboard: LeaderboardEntry[] = [];
  filteredLeaderboard: LeaderboardEntry[] = [];

  ngOnInit(): void {
    this.generateLeaderboard();
    this.filteredLeaderboard = this.leaderboard;
  }

  // Leaderboard methods
  generateLeaderboard(): void {
    const entries: LeaderboardEntry[] = [];

    // Generate entries for each week
    this.weekTypes.forEach(week => {
      for (let i = 0; i < 12; i++) { // 12 entries per week
        entries.push({
          customerId: Math.floor(Math.random() * 900000) + 100000, // 6-digit number
          loginName: this.generateRandomLoginName(),
          place: 0, // Will be assigned after shuffling
          week: week
        });
      }
    });

    // Shuffle the entries randomly
    this.shuffleArray(entries);

    // Assign places after shuffling
    entries.forEach((entry, index) => {
      entry.place = index + 1;
    });

    this.leaderboard = entries;
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  generateRandomLoginName(): string {
    const adjectives = ['Cool', 'Fast', 'Smart', 'Bright', 'Quick', 'Sharp', 'Bold', 'Wild'];
    const nouns = ['Player', 'Gamer', 'Hero', 'Champ', 'Star', 'King', 'Queen', 'Master'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  }

  filterByWeek(week: WeekType | 'ALL'): void {
    this.activeFilter = week;
    
    if (week === 'ALL') {
      this.filteredLeaderboard = this.leaderboard;
    } else {
      this.filteredLeaderboard = this.leaderboard.filter(entry => entry.week === week);
    }
  }
}
