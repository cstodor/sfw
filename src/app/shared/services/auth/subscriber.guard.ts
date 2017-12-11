import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import { IUser } from '../../interfaces/user.interface';

@Injectable()
export class SubscriberGuard implements CanActivate {

  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map((user: IUser) => user && user.assignedRoles.subscriber ? true : false),
      tap(isSubscriber => {
        if (!isSubscriber) {
          console.error('Access denied - Subscribers only');
        }
      })
    );
  }

}
