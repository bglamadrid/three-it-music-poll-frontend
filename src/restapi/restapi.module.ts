import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MusicGenresService } from './services/music-genres.service';
import { PollAnswersService } from './services/poll-answers.service';

/**
 * A module that provides services with explicit bindings to the REST API.
 * Implemented through `HttpClient`.
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    MusicGenresService,
    PollAnswersService
  ]
})
export class RestapiModule { }
