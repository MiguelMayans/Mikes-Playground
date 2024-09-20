import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-child',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard-child.component.html',
  styleUrl: './dashboard-child.component.scss',
})
export class DashboardChildComponent implements OnInit {
  @Input() text: string = '';
  @Output() textChange = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('DashboardChildComponent changes', changes);
  }

  ngOnInit(): void {
    console.log('DashboardChildComponent initialized');
  }

  hancleClick(): void {
    this.text = 'text change by DashboardChildComponent';
    this.textChange.emit(this.text);
  }
}
