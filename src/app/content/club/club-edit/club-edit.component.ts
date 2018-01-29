import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IClub } from '../../../shared/interfaces/club/club.interface';
import { ILocation } from '../../../shared/interfaces/location.interface';
import { IMember } from '../../../shared/interfaces/member/member.interface';
import { ITimeLineEvent } from '../../../shared/interfaces/time-line-event.interface';
import { ClubService } from '../../../shared/services/club/club.service';
import { LocationService } from '../../../shared/services/location/location.service';
import { MemberService } from '../../../shared/services/member/member.service';
import 'rxjs/add/operator/debounceTime';
import { IClubManagement } from '../../../shared/interfaces/club/club-management.interface';
import { ITeamManagement } from '../../../shared/interfaces/team/team-management.interface';

@Component({
  selector: 'club-edit',
  templateUrl: 'club-edit.component.html'
})
export class ClubEditComponent implements OnInit {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return JSON.stringify(this.club).toLowerCase() === JSON.stringify(this.savedClub).toLowerCase();
  }

  public club: IClub;
  private savedClub: IClub;
  public form: FormGroup;
  public locations$: Observable<ILocation[]>;
  public members$: Observable<IMember[]>;
  public showForm: boolean;

  public selectedClubTimeLineEvent: number = -1;

  /* public uploaderOptions: IUploaderOptions = {
    allowedMimeType: ['image/gif', 'image/jpeg', 'image/png'],
    allowedFileType: ['jpg', 'jpeg', 'png', 'gif'],
    path: 'clubs',
    queueLimit: 1
  };

  public uploaderConfig: IUploaderConfig = {
    showOptions: false,
    autoUpload: true,
    showDropZone: true,
    multiple: false,
    removeAfterUpload: true,
    showQueue: false
  }; */

  constructor(public clubService: ClubService,
              private locationService: LocationService,
              private memberService: MemberService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,) {
    this.locations$ = locationService.locations$;
    this.members$ = memberService.members$;
    this.showForm = false;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { club: IClub }) => {
      this.club = data.club;
      this.savedClub = Object.freeze(Object.assign({}, this.club));
      //  this.uploaderOptions.id = data.club.id
    });

    this.form = this.fb.group({
      title: [this.club.title, [Validators.required, Validators.minLength(10)]],
      description: this.club.description,
      assignedLocation: this.club.assignedLocation,
      creation: this.initCreation(),
      management: this.initManagement(),
      history: this.club.history,
      info: this.initInfo(),
      fussballde: this.initFussballDe(),
      timeLine: this.initClubTimeLine(),
      // uploaderConfig: this.initUploaderConfig()
    });

    this.form.valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(
      (changes: IClub) => this.club = changes
    );
  }

  initClubTimeLine(): FormArray {
    const formArray = [];
    if (this.club.timeLine) {
      for (let i = 0; i < this.club.timeLine.length; i++) {
        formArray.push(this.initTimeLineEvent(this.club.timeLine[i]));
      }
    }
    return this.fb.array(formArray);
  }

  initTimeLineEvent(event: ITimeLineEvent): FormGroup {
    return this.fb.group({
      title: [event ? event.title : '', [Validators.required, Validators.maxLength(100)]],
      subTitle: [event ? event.subTitle : ''],
      text: [event ? event.text : ''],
      icon: [event ? event.icon : ''],
      color: [event ? event.color : ''],
      assignedMediaItem: [event ? event.assignedMediaItem : ''],
      assignedArticle: [event ? event.assignedArticle : ''],
      startDate: [event ? event.startDate :  new Date()],
      endDate: [event ? event.endDate :  new Date()]
    });
  }

  addTimeLineEvent(): void {
    const control = <FormArray>this.form.controls['timeLine'];
    const event: ITimeLineEvent = {
      title: '',
      startDate: ''
    };
    const addCtrl = this.initTimeLineEvent(event);
    control.push(addCtrl);
    this.setSelectedClubTimeLineEvent(this.form.controls['timeLine']['controls'].length - 1);
  }

  setSelectedClubTimeLineEvent(event: number): void {
    this.selectedClubTimeLineEvent = event;
  }

  saveTimeLineEvent($event: boolean):void {
    this.selectedClubTimeLineEvent = -1;
  }

  removeTimeLineEvent($event: boolean): void {
    const control = <FormArray>this.form.controls['timeLine'];
    control.removeAt(this.selectedClubTimeLineEvent);
    this.selectedClubTimeLineEvent = -1;
  }

  initInfo(): FormGroup {
    return this.fb.group({
      assignedContact: this.club.info && this.club.info.assignedContact ? this.club.info.assignedContact : '',
      founding: this.club.info && this.club.info.founding ? this.club.info.founding : '',
      clubColours: this.club.info && this.club.info.clubColours ? this.club.info.clubColours : '',
      website: this.club.info && this.club.info.website ? this.club.info.website : '',
    });
  }

  initCreation(): FormGroup {
    return this.fb.group({
      at: this.club.creation.at,
      from: this.club.creation.from
    });
  }

  initFussballDe(): FormGroup {
    return this.fb.group({
      clubId: this.club.fussballde.clubId,
      clubUrl: this.club.fussballde.clubUrl
    });
  }

  initManagement(): FormGroup {
    return this.fb.group({
      positions: this.initClubManagementPositions(),
      photoUrl: this.club.management ? this.club.management.photoUrl : '',
      photoDescription: this.club.management ? this.club.management.photoDescription : ''
    });
  }

  initClubManagementPositions(): FormArray {
    const formArray = [];
    if (this.club.management.positions) {
      for (let i = 0; i < this.club.management.positions.length; i++) {
        formArray.push(this.initClubManagementPosition(this.club.management.positions[i]));
      }
    }
    return this.fb.array(formArray);
  }

  initClubManagementPosition(position: IClubManagement): FormGroup {
    return this.fb.group({/*
      title: [event ? event.title : '', [Validators.required, Validators.maxLength(100)]],
      subTitle: [event ? event.subTitle : ''],
      text: [event ? event.text : ''],
      icon: [event ? event.icon : ''],
      color: [event ? event.color : ''],
      assignedMediaItem: [event ? event.assignedMediaItem : ''],
      assignedArticle: [event ? event.assignedArticle : ''],
      startDate: [event ? event.startDate :  new Date()],
      endDate: [event ? event.endDate :  new Date()]
    */});
  }

  saveClub(): void {
    let action;
    if (this.club.id) {
      action = this.clubService.updateClub(this.club.id, this.form.getRawValue());
    } else {
      action = this.clubService.createClub(this.club);
    }
    action.then(
      () => this.redirectToList(),
      (error: any) => console.log(error)
    );
  }


  cancel() {
    this.redirectToList();
  }

  redirectToList() {
    this.router.navigate(['/clubs']).then();
  }

  /* logoUploadCompleted(fileItem: FileItem) {
    this.club.logoUrl = fileItem.url;
    // this.clubService.updateClub(this.club.id, this.club).then();
  }

  initUploaderConfig() {
    return this.fb.group(this.uploaderConfig);
  } */

}
