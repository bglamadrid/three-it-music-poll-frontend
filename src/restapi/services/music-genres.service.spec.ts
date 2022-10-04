import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RestapiMusicGenre } from '../models/RestapiMusicGenre';

import { MusicGenresService } from './music-genres.service';

describe('MusicGenresService', () => {
  let service: MusicGenresService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        MusicGenresService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.inject(MusicGenresService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    httpClientSpy.get.and.returnValue(EMPTY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do a GET request to fetch music genres', () => {
    service.getMusicGenres();
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should return an array containing the music genre names', () => {
    const genres: RestapiMusicGenre[] = [
      { music_genre_name: 'Rock' },
      { music_genre_name: 'Pop' },
      { music_genre_name: 'Jazz' }
    ];
    const names = ['Rock', 'Pop', 'Jazz'];
    httpClientSpy.get.and.returnValue(of(genres));
    service.getMusicGenres().pipe(
      tap(genreNames => expect(genreNames).toEqual(names))
    ).subscribe();
  });
});
