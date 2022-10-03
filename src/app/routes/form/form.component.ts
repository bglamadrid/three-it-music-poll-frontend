import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { PollForm } from 'src/app/models/PollForm';
import { MusicGenresService } from 'src/restapi/services/music-genres.service';
import { PollAnswersService } from 'src/restapi/services/poll-answers.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formGroup: FormGroup;
  musicGenreNames$: Observable<string[]>;
  submitting: Partial<Subscription> = { closed: true };

  constructor(
    formBuilder: FormBuilder,
    private musicGenresApi: MusicGenresService,
    private pollAnswersApi: PollAnswersService
  ) {
    this.formGroup = formBuilder.group({
      musicGenre: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
    this.musicGenreNames$ = this.musicGenresApi.getMusicGenres();
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.submitting.closed) {
      const form = this.formGroup.value as PollForm;
      this.submitting = this.pollAnswersApi.postPollAnswer(form).pipe(
        delay(1000),
        tap({
          next: () => {
            alert('OK!');
          },
          error: () => {
            alert('ERROR!');
          }
        })
      ).subscribe();
    }
  }

}
