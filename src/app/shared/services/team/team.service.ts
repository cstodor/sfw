import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITeam } from '../../interfaces/team/team.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

  private collectionRef: AngularFirestoreCollection<ITeam>;
  private path = `teams`;

  teams$: Observable<ITeam[]>;

  constructor(private afs: AngularFirestore,
    private authService: AuthService) {
    this.collectionRef = this.afs.collection<ITeam>(this.path);
    this.teams$ = this.collectionRef.valueChanges();
  }

  createTeam(team: ITeam): Promise<void> {
    team.id = this.afs.createId();
    return this.afs.collection(this.path).doc(team.id).set(team);
  }

  removeTeam(team: ITeam): Promise<void> {
    return this.afs.collection(this.path).doc(team.id).delete();
  }

  updateTeam(teamId: string, team: ITeam): Promise<any> {
    return this.afs.collection(this.path).doc(teamId).update(team);
  }

  getTeamById(teamId: string): Observable<ITeam> {
    return this.afs.doc<ITeam>(this.path + '/' + teamId).valueChanges();
  }

  setNewTeam(): ITeam {
    return {
      title: '',
      subTitle: '',
      isOfficialTeam: true,
      creation: this.authService.getCreation(),
      assignedTeamCategory: null,
      assignedClub: null,
      assignedSeason: null,
      assignedPlayers: [],
      assignedCompetitions: [],
      assignedEvents: [],
      assignedPositions: [],
      assignedTrainings: []
    };
  }
}
