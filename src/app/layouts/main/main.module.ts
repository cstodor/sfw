import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../../../environments/environment';
import { AuthGuard } from '../../shared/services/auth/auth.guard';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UnAuthGuard } from '../../shared/services/auth/unauth.guard';
import { mainRoutes } from './main.routing';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(mainRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
  ],
  providers: [
    AngularFireAuth,
    AuthGuard,
    AuthService,
    // EditorGuard,
    UnAuthGuard
  ]
})
export class MainModule { }
