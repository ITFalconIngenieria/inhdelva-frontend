import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}

@Component({
  selector: 'app-bloquesHorarios',
  templateUrl: './bloquesHorarios.component.html',
  styleUrls: ['./bloquesHorarios.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BloquesHorariosComponent implements OnInit, OnDestroy {
  ds = new MyDataSource(this.http);

  private destroy$ = new Subject();

  isVisible = false;
  date = null;
  inputValue: string;

  listOfData = [
    {
      id: 1,
      clase_dia: 'Laborable',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    },
    {
      id: 1,
      clase_dia: 'Sabado',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    },
    {
      id: 1,
      clase_dia: 'Domingo o Feriado',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    }
  ];

  constructor(
    private message: NzMessageService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.ds
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.message.warning('Infinite List loaded all');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  onValueChange(value: Date): void {
    console.log(`Current value: ${value}`);
  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log(`Current value: ${change.date}`);
    console.log(`Current mode: ${change.mode}`);
  }
}

class MyDataSource extends DataSource<ItemData> {
  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(private http: HttpClient) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.http
      .get<{ results: ItemData[] }>(`https://randomuser.me/api/?results=${this.pageSize}&inc=name,gender,email,nat&noinfo`)
      .subscribe(res => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.results);
        this.dataStream.next(this.cachedData);
      });
  }
}




