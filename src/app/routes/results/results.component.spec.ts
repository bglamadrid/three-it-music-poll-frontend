import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { EMPTY, of } from 'rxjs';
import { PollResult } from 'src/app/models/PollResult';
import { PollAnswersService } from 'src/restapi/services/poll-answers.service';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let pollAnswersServiceSpy: jasmine.SpyObj<PollAnswersService>;

  beforeEach(waitForAsync(() => {
    const mockPollAnswersService = jasmine.createSpyObj('PollAnswersService', ['getPollResult']);
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        NgChartsModule
      ],
      providers: [
        { provide: PollAnswersService, useValue: mockPollAnswersService }
      ]
    })
    .compileComponents();

    pollAnswersServiceSpy = TestBed.inject(PollAnswersService) as jasmine.SpyObj<PollAnswersService>;
    pollAnswersServiceSpy.getPollResult.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch poll results', () => {
    expect(pollAnswersServiceSpy.getPollResult).toHaveBeenCalled();
  });

  it('should transform PollResult into a valid bar chart data object', () => {
    jasmine.clock().install();
    const pollResult: PollResult = {
      'Jazz': ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'],
      'Latina': ['e@test.com', 'f@test.com', 'g@test.com']
    };
    const expectedChartData: ChartData<'bar'> = {
      datasets: [{ data: [4, 3] }],
      labels: ['Jazz', 'Latina']
    };
    pollAnswersServiceSpy.getPollResult.and.returnValue(of(pollResult));
    component.reload();
    jasmine.clock().tick(1000);
    expect(component.barChartData).toEqual(expectedChartData);
    jasmine.clock().uninstall();
  });
});
