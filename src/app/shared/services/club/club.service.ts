import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IClub } from '../../interfaces/club/club.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ClubService {

  private collectionRef: AngularFirestoreCollection<IClub>;
  private path = `clubs`;

  clubs$: Observable<IClub[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.collectionRef = this.afs.collection<IClub>(this.path);
    this.clubs$ = this.collectionRef.valueChanges();
  }

  createClub(club: IClub): Promise<void> {
    club.id = this.afs.createId();
    return this.afs.collection(this.path).doc(club.id).set(club);
  }

  removeClub(club: IClub): Promise<void> {
    return this.afs.collection(this.path).doc(club.id).delete();
  }

  updateClub(clubId: string, club: IClub): Promise<any> {
    return this.afs.collection(this.path).doc(clubId).update(club);
  }

  getClubById(clubId: string): Observable<IClub> {
    return this.afs.doc<IClub>(this.path + '/' + clubId).valueChanges();
  }

  setNewClub(): Observable<IClub> {
    return Observable.of({
      title: '',
      description: '',
      info: {},
      creation: this.authService.getCreation(),
      fussballde: {},
      assignedFiles: [],
      timeLine: [],
      assignedLocation: null,
      honoraries: [],
      management: {
        positions: [],
        timeLine: []
      }
    });
  }
}
