import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../../shared/services/location/location.service';
import { CategoryTypeService } from '../../../shared/services/category-type/category-type.service';
import { ILocation } from '../../../shared/interfaces/location.interface';
import { CategoryService } from '../../../shared/services/category/category.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ICategoryType } from '../../../shared/interfaces/category-type.interface';
import { ILocationContact } from '../../../shared/interfaces/location-contact.interface';
import { MemberService } from '../../../shared/services/member/member.service';
import { IMember } from '../../../shared/interfaces/member/member.interface';
import { IUploaderConfig } from '../../../shared/interfaces/media/uploader-config.interface';
import { IUploderOptions } from '../../../shared/interfaces/media/uploader-options.interface';
import { Upload } from '../../../shared/services/media/upload.class';
import { ComponentCanDeactivate } from '../../../shared/services/auth/pending-changes.guard';

@Component({
  selector: 'location-edit',
  templateUrl: 'location-edit.component.html'
})

export class LocationEditComponent implements OnInit, ComponentCanDeactivate {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(JSON.stringify(this.location).toLowerCase() === JSON.stringify(this.savedLocation).toLowerCase());
    return JSON.stringify(this.location).toLowerCase() === JSON.stringify(this.savedLocation).toLowerCase();
  }

  public savedLocation: ILocation;
  public location: ILocation;
  public form: FormGroup;
  public categories$: Observable<ICategory[]>;
  public categoryTypes$: Observable<ICategoryType[]>;
  public members$: Observable<IMember[]>;

  public logoUploaderConfig: IUploaderConfig = {
    showDropZone: true,
    showQueue: false,
    multiple: false,
    autoUpload: false
  };

  public logoUploaderOptions: IUploderOptions = {
    maxFileSize: 100,
    // allowedMimeType: ['image/gif', 'image/tiff'],
    allowedFileType: ['image'],
    path: 'locations'
  };

  constructor(private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              public categoryService: CategoryService,
              public categoryTypeService: CategoryTypeService,
              public locationService: LocationService,
              private memberService: MemberService) {
    this.categories$ = categoryService.categories$;
    this.categoryTypes$ = categoryTypeService.categoryTypes$;
    this.members$ = memberService.members$;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { location: ILocation }) => {
      this.location = data.location;
      this.savedLocation = Object.freeze(Object.assign({}, this.location));
      this.logoUploaderOptions.id = this.location.id;
    });

    this.form = this.fb.group({
      title: [this.location.title, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      assignedCategory: [this.location.assignedCategory, [Validators.required]],
      prices: this.location.prices,
      opening: this.location.opening,
      text: this.location.text,
      address: this.initAddress(),
      creation: this.initCreation(),
      assignedContacts: this.initAssignedContacts()
    });

    if (this.location.isImported) {
      this.form.get('title').disable();
      this.form.get('assignedCategory').disable();
      this.form.get('address').disable();
      this.form.get('creation').disable();
    }
  }

  logoUploadCompleted($event: Upload) {
    $event.downloadUrl.subscribe((downloadUrl: string) => {
      this.location.imageUrl = downloadUrl;
      this.location.id ? this.locationService.updateLocation(this.location.id, this.location) : this.locationService.createLocation(this.location);
    });
  }

  initAssignedContacts() {
    const formArray = [];
    if (this.location.assignedContacts) {
      for (let i = 0; i < this.location.assignedContacts.length; i++) {
        formArray.push(this.initLocationContact(this.location.assignedContacts[i]));
      }
    }
    return this.fb.array(formArray);
  }

  initLocationContact(contact: ILocationContact): FormGroup {
    return this.fb.group({
      isMember: contact ? contact.isMember : '',
      description: contact ? contact.description : '',
      assignedMember: contact ? contact.assignedMember : '',
      firstName: contact ? contact.firstName : '',
      lastName: contact ? contact.lastName : '',
      contact: this.initContactData(contact),
      address: contact ? contact.address : '',
    });
  }

  addLocationContact(): void {
    const control = <FormArray>this.form.controls['assignedContacts'];
    const contact: ILocationContact = {
      isMember: false,
      description: '',
    };
    const addCtrl = this.initLocationContact(contact);
    control.push(addCtrl);
  }

  removeLocationContact(i: number) {
    const control = <FormArray>this.form.controls['assignedContacts'];
    control.removeAt(i);
  }

  initContactData(contact: ILocationContact) {
    return this.fb.group({
      email: contact.contact ? contact.contact.email : '',
      phoneMobile: contact.contact ? contact.contact.phoneMobile : '',
    })
  }

  initCreation(): FormGroup {
    return this.fb.group({
      at: this.location.creation.at,
      from: this.location.creation.from
    });
  }

  initAddress() {
    return this.fb.group({
      streetName: [this.location.address.streetName, [Validators.required, Validators.minLength(5)]],
      houseNumber: this.location.address.houseNumber === 0 ? '' : this.location.address.houseNumber,
      zip: [this.location.address.zip, [Validators.required]],
      city: [this.location.address.city, [Validators.required]],
      county: [this.location.address.county, [Validators.required]],
    });
  }

  saveLocation() {
    let action;
    if (this.location.id) {
      action = this.locationService.updateLocation(this.location.id, this.form.getRawValue());
    } else {
      action = this.locationService.createLocation(this.form.getRawValue());
    }
    action.then(
      () => {
        this.savedLocation = this.location;
        this.navigateToList();
      },
      (error: any) => console.log(error)
    );
  }

  navigateToList() {
    this.router.navigate(['/locations']).then();
  }

  cancel() {
    this.savedLocation = this.location;
    this.navigateToList();
  }

}
