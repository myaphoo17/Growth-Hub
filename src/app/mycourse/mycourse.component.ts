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
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit {
  cards: Card[] = [
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },{
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },

    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: 'This is some content inside a card. More text can be added here to provide additional information.',
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: 'Linux for ',
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    }

    // Additional card data...
  ];

  pageSize = 8;
  pageIndex = 0;
  pagedCards: Card[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Non-null assertion operator

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
    this.pagedCards = this.cards.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards();
  }
}
