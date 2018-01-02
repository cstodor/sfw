import { NgModule } from '@angular/core';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationsComponent } from './locations/locations.component';
import { locationRoutingModule } from './location-routing.module';
import { LocationResolver } from './location.resolver';
import { SharedModule } from '../../shared/shared.module';
import { CategoryService } from '../../shared/services/category/category.service';
import { CategoryTypeService } from '../../shared/services/category-type/category-type.service';
import { LocationService } from '../../shared/services/location/location.service';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatTableModule, MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { MemberService } from '../../shared/services/member/member.service';
import { LocationDetailMainComponent } from './location-detail/location-detail-main/location-detail-main.component';
import { LocationDetailMapComponent } from './location-detail/location-detail-map/location-detail-map.component';
import { AgmCoreModule } from '@agm/core';
import { MapsService } from '../../shared/services/maps/maps.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationDetailContactComponent } from './location-detail/location-detail-contact/location-detail-contact.component';
import { ArticleService } from '../../shared/services/article/article.service';
import { LocationMapComponent } from './location-map/location-map.component';
import { LocationDetailMediaComponent } from './location-detail/location-detail-media/location-detail-media.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { QuillModule } from 'ngx-quill';
import { UserService } from '../../shared/services/user/user.service';

@NgModule({
  imports: [
    AgmCoreModule,
    FlexLayoutModule,
    HttpClientModule,
    locationRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    QuillModule,
    SharedModule
  ],
  declarations: [
    LocationDetailComponent,
    LocationDetailContactComponent,
    LocationDetailMapComponent,
    LocationDetailMediaComponent,
    LocationEditComponent,
    LocationListComponent,
    LocationMapComponent,
    LocationsComponent,
    LocationDetailMainComponent
  ],
  providers: [
    ArticleService,
    CategoryService,
    CategoryTypeService,
    LocationResolver,
    LocationService,
    MapsService,
    MemberService
  ]
})
export class LocationModule {
}
