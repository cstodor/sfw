import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IMember } from '../../../../shared/interfaces/member/member.interface';

@Component({
  selector: 'club-honoraries',
  templateUrl: './club-honoraries.component.html'
})
export class ClubHonorariesComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() selectedHonorary: number;
  @Input() members: IMember[];

  @Output() add: EventEmitter<boolean> = new EventEmitter(false);
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() save: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public step = -1;

  constructor() {
  }

  ngOnInit() {
    console.log('ToDo: get articles and members => save Honorary; show List of current Honoraries');
  }
}
