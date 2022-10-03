import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { reduce, switchMap } from 'rxjs/operators';
import { PollResult } from 'src/app/models/PollResult';
import { PollForm } from 'src/app/models/PollForm';
import { environment } from 'src/environments/environment';
import { RestapiPollAnswer } from '../models/RestapiPollAnswer';

@Injectable()
export class PollAnswersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  postPollAnswer(answer: PollForm) {
    return this.httpClient.post<any>(
      `${environment.restapi.baseUrl}/poll_answers`,
      {
        mail: answer.email,
        music_genre_name: answer.musicGenre
      } as RestapiPollAnswer
    );
  }

  getPollResult() {
    return this.httpClient.get<RestapiPollAnswer[]>(
      `${environment.restapi.baseUrl}/poll_answers`
    ).pipe(
      switchMap(answers => from(answers)),
      reduce(
        (accumulator: PollResult, value: RestapiPollAnswer) => {
          const vote = value.music_genre_name;
          if (vote in accumulator) {
            accumulator[vote].push(value.mail);
          } else {
            accumulator[vote] = [value.mail];
          }
          return accumulator;
        },
        {} as PollResult
      )
    );
  }
}
