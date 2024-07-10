import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/admin/notification.service';

interface Card {
  title: string;
  subtitle: string;
  image: string;
  content: string;
  showMore: boolean;
  showDetails: boolean;
  updated: string;
  details: string;
  features: string[];
}

@Component({
  selector: 'app-adm-nav-bar',
  templateUrl: './adm-nav-bar.component.html',
  styleUrls: ['./adm-nav-bar.component.css']
})
export class AdmNavBarComponent implements OnInit {
  @Input() cards: Card[] = [];
  searchText: string = '';
  filteredCards: Card[] = [];
  constructor(private notificationService: NotificationService) {}


  openNotifications() {
    this.notificationService.openNotificationDialog();
  }

  ngOnInit() {
    this.filteredCards = this.cards;
  }

  filterCards() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredCards = this.cards.filter(card =>
      card.title.toLowerCase().includes(searchLower) ||
      card.subtitle.toLowerCase().includes(searchLower) ||
      card.content.toLowerCase().includes(searchLower)
    );
  }
}
