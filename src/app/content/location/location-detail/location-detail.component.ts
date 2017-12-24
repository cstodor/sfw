import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../shared/services/category/category.service';
import { ILocation } from '../../../shared/interfaces/location.interface';
import { IArticle } from '../../../shared/interfaces/article.interface';
import { IMember } from '../../../shared/interfaces/member/member.interface';
import { MemberService } from '../../../shared/services/member/member.service';
import { LocationService } from '../../../shared/services/location/location.service';
import { Observable } from 'rxjs/Observable';
import { ICategory } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'location-detail',
  templateUrl: 'location-detail.component.html'
})

export class LocationDetailComponent implements OnInit {

  location: ILocation;
  categories$: Observable<ICategory[]>;
  articles$: Observable<IArticle[]>;
  members$: Observable<IMember[]>;

  constructor(private route: ActivatedRoute,
              // private articleService: ArticleService,
              public categoryService: CategoryService,
              public memberService: MemberService,
              private locationService: LocationService,
              private router: Router) {
    // this.articles$ = articleService.articles$;
    this.categories$ = categoryService.categories$;
    this.members$ = memberService.members$;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { location: ILocation }) => this.location = data.location);
  }

  removeLocation(location: ILocation) {
    this.locationService.removeLocation(location).then(() => this.router.navigate(['/locations']).then());
  }

}

