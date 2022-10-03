import { TestBed } from '@angular/core/testing';

import { PollAnswersService } from './poll-answers.service';

describe('PollAnswersService', () => {
  let service: PollAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
