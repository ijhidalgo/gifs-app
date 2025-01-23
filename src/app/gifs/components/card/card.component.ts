import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  standalone: false,

  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  ngOnInit(): void {
    if (!this.gif) throw new Error('Gif property is required');
  }

  @Input()
  public gif!: Gif;
}
