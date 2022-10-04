import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { PollResult } from 'src/app/models/PollResult';
import { PollAnswersService } from 'src/restapi/services/poll-answers.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnDestroy {
  loading = true;
  error = false;
  errorDescription: string | undefined;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };
  barChartData: ChartData<'bar'> | undefined;
  loadingSubscription: Subscription | undefined;

  constructor(
    private pollAnswersService: PollAnswersService
  ) {
    this.fetchRenderPollResult();
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  public reload(): void {
    if (!this.loading) {
      this.loading = true;
      this.error = false;
      this.fetchRenderPollResult();
    }
  }

  private fetchRenderPollResult(): void {
    this.loadingSubscription = this.pollAnswersService.getPollResult().pipe(
      delay(1000),
      map(toBarChartData),
      tap({
        next: (data) => {
          this.barChartData = data;
          this.chart?.update();
        },
        error: (error) => {
          this.barChartData = undefined;
          this.error = true;
          this.errorDescription = error.message;
          this.loading = false;
        },
        complete: () => { this.loading = false; }
      })
    ).subscribe();
  }
}

function toBarChartData(pollResult: PollResult): ChartData<'bar'> {
  const labels = [];
  const data = [];
  for (const musicGenre in pollResult) {
    if (Object.prototype.hasOwnProperty.call(pollResult, musicGenre)) {
      const votes = pollResult[musicGenre].length;
      labels.push(musicGenre);
      data.push(votes);
    }
  }
  return {
    datasets: [{ data }],
    labels
  };
}
