import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RestapiMusicGenre } from '../models/RestapiMusicGenre';

@Injectable()
export class MusicGenresService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getMusicGenres() {
    return this.httpClient.get<RestapiMusicGenre[]>(
      `${environment.restapi.baseUrl}/music_genres`
    ).pipe(
      switchMap(genres => from(genres)),
      map(genre => genre.music_genre_name),
      toArray()
    );
  }
}
