import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { map, take, tap } from 'rxjs/operators';
import { IUser } from '../../interfaces/user.interface';

@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map((user: IUser) => !user),
      tap(isLoggedOut => {
        if (!isLoggedOut) {
          console.error('You´re already logged in - redirecting ...');
          this.router.navigate(['/']).then();
        }
      })
    );
  }
}
