import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, timer } from 'rxjs';
import { MusicGenresService } from 'src/restapi/services/music-genres.service';
import { PollAnswersService } from 'src/restapi/services/poll-answers.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let musicGenresServiceSpy: jasmine.SpyObj<MusicGenresService>;
  let pollAnswersServiceSpy: jasmine.SpyObj<PollAnswersService>;

  beforeEach(waitForAsync(() => {
    const mockMusicGenresService = jasmine.createSpyObj('MusicGenresService', ['getMusicGenres']);
    const mockPollAnswersService = jasmine.createSpyObj('PollAnswersService', ['postPollAnswer']);
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule
      ],
      providers: [
        { provide: MusicGenresService, useValue: mockMusicGenresService },
        { provide: PollAnswersService, useValue: mockPollAnswersService },
        { provide: MatSnackBar, useValue: {} } // TODO create a spy for this snackbar
      ]
    })
    .compileComponents();

    musicGenresServiceSpy = TestBed.inject(MusicGenresService) as jasmine.SpyObj<MusicGenresService>;
    pollAnswersServiceSpy = TestBed.inject(PollAnswersService) as jasmine.SpyObj<PollAnswersService>;

    musicGenresServiceSpy.getMusicGenres.and.returnValue(of([]));
    pollAnswersServiceSpy.postPollAnswer.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch music genres', () => {
    expect(musicGenresServiceSpy.getMusicGenres).toHaveBeenCalled();
  });

  it('should request a service to submit the answer to the server', () => {
    expect(pollAnswersServiceSpy.postPollAnswer).not.toHaveBeenCalled();
    component.onSubmit();
    expect(pollAnswersServiceSpy.postPollAnswer).toHaveBeenCalled();
  });

  it('should turn the RxJS subscription on', () => {
    expect(component.submitting.closed).toBeTrue();
    component.onSubmit();
    expect(component.submitting.closed).toBeFalse();
  });

  it('should lock the submit button', () => {
    const submitButton = (fixture.nativeElement as HTMLElement).querySelector('button[type=submit]') as HTMLButtonElement;
    component.onSubmit();
    expect(submitButton.disabled).toBeTrue();
  });

  it('should lock inmediate consecutive submissions', () => {
    jasmine.clock().install();
    component.onSubmit();
    component.onSubmit();
    component.onSubmit();
    expect(pollAnswersServiceSpy.postPollAnswer).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(1000);
    component.onSubmit();
    expect(pollAnswersServiceSpy.postPollAnswer).toHaveBeenCalledTimes(2);
    jasmine.clock().uninstall();
  });
});
