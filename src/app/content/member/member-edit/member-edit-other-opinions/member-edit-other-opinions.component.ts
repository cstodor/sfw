import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { IProfile } from '../../../../shared/interfaces/member/profile.interface';
import { IMember } from '../../../../shared/interfaces/member/member.interface';

@Component({
  selector: 'member-edit-other-opinions',
  templateUrl: './member-edit-other-opinions.component.html',
  styleUrls: ['./member-edit-other-opinions.component.scss']
})
export class MemberEditOtherOpinionsComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() members: IMember[];

  @Output() add: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() delete: EventEmitter<IProfile> = new EventEmitter<IProfile>(false);

  @Output() toggleMemberLookup: EventEmitter<{ id: number, type: string }> = new EventEmitter<{ id: number, type: string }>(false);


  constructor() {
  }

  ngOnInit() {
    this.subscribeToMemberLookupChanges();
  }

  subscribeToMemberLookupChanges() {

    const formControl = (<any>this.form).controls['opinions'];

    const changes$ = formControl.valueChanges;

    changes$.subscribe((changes: any) => {

      for (let i = 0; i < changes.length; i++) {

        const textFieldCtrl = formControl['controls'][i]['controls']['name'];
        const selectFieldCtrl = formControl['controls'][i]['controls']['assignedMember'];

        if (changes[i].type === 'textField') {
          Object.keys(textFieldCtrl.controls).forEach(key => {
            textFieldCtrl.controls[key].setValidators(Validators.required, Validators.minLength(3));
            textFieldCtrl.controls[key].updateValueAndValidity();
          });

          Object.keys(selectFieldCtrl.controls).forEach(key => {
            selectFieldCtrl.controls[key].setValidators(null);
            selectFieldCtrl.controls[key].updateValueAndValidity();
          });
        }

        if (changes[i].type === 'selectField') {

          Object.keys(selectFieldCtrl.controls).forEach(key => {
            selectFieldCtrl.controls[key].setValidators(Validators.required, Validators.minLength(3));
            selectFieldCtrl.controls[key].updateValueAndValidity();
          });

          Object.keys(textFieldCtrl.controls).forEach(key => {
            textFieldCtrl.controls[key].setValidators(null);
            textFieldCtrl.controls[key].updateValueAndValidity();
          });
        }

      }

    });
  }

}
