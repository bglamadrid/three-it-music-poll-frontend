import { TestBed } from '@angular/core/testing';

import { MusicGenresService } from './music-genres.service';

describe('MusicGenresService', () => {
  let service: MusicGenresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicGenresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
