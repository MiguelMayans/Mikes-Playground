import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [],
  template: `
    <ul>
      <p>Estos son los juegos de {{ username }}</p>
      @for (game of games; track game.id) {
      <li>{{ game.name }}</li>
      }
    </ul>
  `,
  styles: ``,
})
export class GamesComponent {
  @Input() username = '';

  games = [
    {
      id: 1,
      name: 'Uncharted 4',
    },
    {
      id: 2,
      name: 'The Witcher 3',
    },
    {
      id: 3,
      name: 'Sekiro: Shadows Die Twice',
    },
  ];
}
