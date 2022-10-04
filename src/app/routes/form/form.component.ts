import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private pollAnswersApi: PollAnswersService,
    private snackBarService: MatSnackBar
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
            this.snackBarService.open('Su respuesta fue guardada con éxito. ¡Gracias por participar!', 'OK');
          },
          error: (error) => {
            if (error.status === 500) {
              this.snackBarService.open('No puede enviar más de una respuesta con el mismo correo.', 'OK');
            } else if (error.status === 400) {
              this.snackBarService.open('Respuesta inválida. Verifique que la información ingresada es correcta e intente nuevamente.', 'OK');
            } else {
              this.snackBarService.open(`El servidor no pudo recibir su respuesta. Detalles del error: '${error.message}'`, 'OK');
            }
          }
        })
      ).subscribe();
    }
  }

}
