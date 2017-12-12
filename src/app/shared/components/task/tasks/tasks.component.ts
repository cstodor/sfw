import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { Observable } from 'rxjs/Observable';
import { ITask } from '../../../interfaces/task.interface';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../interfaces/user.interface';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit, OnDestroy {

  @Input() type: string = '';

  tasks$: Observable<ITask[]>;
  user: IUser;

  public showForm: boolean = false;
  private userSubscription: ISubscription;

  constructor(private taskService: TaskService, private authService: AuthService) {
    this.tasks$ = taskService.tasks$;
  }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((user: IUser) => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

}
