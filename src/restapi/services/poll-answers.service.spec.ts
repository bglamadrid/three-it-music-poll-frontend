import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PollForm } from 'src/app/models/PollForm';
import { PollResult } from 'src/app/models/PollResult';
import { RestapiPollAnswer } from '../models/RestapiPollAnswer';

import { PollAnswersService } from './poll-answers.service';

describe('PollAnswersService', () => {
  let service: PollAnswersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        PollAnswersService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.inject(PollAnswersService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    httpClientSpy.get.and.returnValue(EMPTY);
    httpClientSpy.post.and.returnValue(EMPTY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do a GET request to fetch poll results', () => {
    service.getPollResult();
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should transform poll answers together into a results overview', () => {
    const answers: RestapiPollAnswer[] = [
      { mail: 'example1@test.com', music_genre_name: 'Rock' },
      { mail: 'example2@test.com', music_genre_name: 'Rock' },
      { mail: 'example3@test.com', music_genre_name: 'Pop' }
    ];
    const expectedResult: PollResult = {
      'Rock': ['example1@test.com', 'example2@test.com'],
      'Pop': ['example3@test.com']
    };
    httpClientSpy.get.and.returnValue(of(answers));
    service.getPollResult().pipe(
      tap(result => expect(result).toEqual(expectedResult))
    ).subscribe();
  });

  it('should do a POST request to submit a new poll answer', () => {
    service.postPollAnswer({} as PollForm);
    expect(httpClientSpy.post).toHaveBeenCalled();
  });
});
