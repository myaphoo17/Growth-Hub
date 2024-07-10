import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  cards: Card[] = [
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for Developers`,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
 
  ];

 

  pageSize = 4; // Number of cards per page
  currentPageIndex = 0;
  pagedCards: Card[] = [];
courses: any;

  ngOnInit() {
    this.updatePagedCards();
  }

  toggleShowMore(card: Card) {
    card.showMore = !card.showMore;
  }

  showDetails(card: Card) {
    card.showDetails = true;
  }

  hideDetails(card: Card) {
    card.showDetails = false;
  }

  updatePagedCards() {
    const startIndex = this.currentPageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCards = this.cards.slice(startIndex, endIndex);
  }

  loadMore() {
    if (this.hasMoreCards()) {
      this.currentPageIndex++;
      this.updatePagedCards();
    }
  }

  loadPrevious() {
    if (this.hasPreviousCards()) {
      this.currentPageIndex--;
      this.updatePagedCards();
    }
  }

  hasMoreCards() {
    return (this.currentPageIndex + 1) * this.pageSize < this.cards.length;
  }

  hasPreviousCards() {
    return this.currentPageIndex > 0;
  }

  
}





