import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operator/map';
import 'rxjs/operator/take';
import { IUser } from '../../shared/interfaces/user.interface';
import { UserService } from '../../shared/services/user/user.service';

@Injectable()
export class UserResolver implements Resolve<IUser> {

  constructor(private userService: UserService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
    return this.userService.getUserById(route.params['userId']).take(1).map((user: IUser) => {
      console.log(user);
      if (route.params['userId'] === 'new') {
        return this.userService.setNewUser();
      } else if (user && user.id) {
        return user;
      } else {
        this.router.navigate(['/users']).then();
      }
    });
  }

}
