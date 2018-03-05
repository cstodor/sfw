import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam } from '../../../shared/interfaces/team/team.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ISeason } from '../../../shared/interfaces/season.interface';
import { IClub } from '../../../shared/interfaces/club/club.interface';
import { ICategoryType } from '../../../shared/interfaces/category-type.interface';

@Component({
  selector: 'team-list',
  templateUrl: 'team-list.component.html',
})

export class TeamListComponent {

  @Input() teams: ITeam[];
  @Input() categories: ICategory[];
  @Input() seasons: ISeason[];
  @Input() clubs: IClub[];

  @Output() remove = new EventEmitter(false);
  @Output() update = new EventEmitter(false);

  public form: FormGroup;
  public itemsPerPageOptions = [5, 10, 25, 50, 100];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      searchFor: '',
      limit: 10
    });
  }

  removeTeam(team: ITeam) {
    this.remove.emit(team);
    this.form.controls['searchFor'].reset();
  }

}
