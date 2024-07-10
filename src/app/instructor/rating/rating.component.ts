import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  showMore: boolean = false;
  showAllReviews = false;
  showAddReviewForm = false;
  reviewForm: FormGroup;
  selectedStars = 0;
  reviewContent = '';

  allReviews = [
    {
      author: 'Reviewer1',
      date: 'Jan 1, 2023',
      content: 'Great course!'
    },
    {
      author: 'Reviewer2',
      date: 'Feb 15, 2023',
      content: 'Very informative.'
    },
    {
      author: 'Reviewer3',
      date: 'Feb 20, 2023',
      content: 'Very engaging and practical.'
    }
    // Add more reviews as needed
  ];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [5, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  toggleAllReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  toggleAddReviewForm() {
    this.showAddReviewForm = !this.showAddReviewForm;
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const newReview = {
        author: 'New Reviewer', // This would normally come from user data
        date: new Date().toLocaleDateString(),
        content: this.reviewForm.value.description
      };
      this.allReviews.push(newReview);
      this.reviewForm.reset({ rating: 5, description: '' });
      this.showAddReviewForm = false;
    }
  }

  submitReview() {
    // You can handle the submission logic here, like sending the review to a server
    // For now, let's just log the review content and stars
    console.log('Stars:', this.selectedStars);
    console.log('Review:', this.reviewContent);

    // Optionally, you can clear the form fields after submission
    this.selectedStars = 0;
    this.reviewContent = '';
    this.showAddReviewForm = false;
  }

  cancelReview() {
    // Clear form fields and hide the form
    this.selectedStars = 0;
    this.reviewContent = '';
    this.showAddReviewForm = false;
  }
}
 