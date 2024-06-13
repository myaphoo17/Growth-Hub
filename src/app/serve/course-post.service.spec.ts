import { TestBed } from '@angular/core/testing';

import { CoursePostService } from './course-post.service';

describe('CoursePostService', () => {
  let service: CoursePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
