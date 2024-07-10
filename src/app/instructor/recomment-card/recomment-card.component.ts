import { Component, OnInit } from '@angular/core';

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
  selector: 'app-recomment-card',
  templateUrl: './recomment-card.component.html',
  styleUrls: ['./recomment-card.component.css']
})
export class RecommentCardComponent {
  cards: Card[] = [
    {
      title: 'Card Title 1',
      subtitle: 'Card Subtitle 1',
      image: 'https://via.placeholder.com/150',
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
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
      content: `This is some content inside a card. More text can be added here to provide additional information.`,
      showMore: false,
      showDetails: false,
      updated: 'January 2023',
      details: `Linux for `,
      features: [
        'Learn foundational Linux skills',
        'Learn how to practically use Linux in your networks',
        'Build Linux networks using GNS3'
      ]
    },
    // Additional card data here...
  ];

  showAll = false;

  constructor() {}

  ngOnInit(): void {}

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  toggleShowMore(card: any): void {
    card.showMore = !card.showMore;
  }

  showDetails(card: any): void {
    card.showDetails = true;
  }

  hideDetails(card: any): void {
    card.showDetails = false;
  }
}
