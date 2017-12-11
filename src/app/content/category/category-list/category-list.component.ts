import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICategoryType } from '../../../shared/interfaces/category-type.interface';
import { CategoryService } from '../../../shared/services/category/category.service';

@Component({
  selector: 'category-list',
  templateUrl: 'category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit {

  // @Input() articles: IArticle[];
  @Input() categories: ICategory[];
  @Input() categoryTypes: ICategoryType[];
  // @Input() locations: ILocation[];
  // @Input() teams: ITeam[];

  @Output() remove: EventEmitter<any> = new EventEmitter(false);
  @Output() update: EventEmitter<any> = new EventEmitter(false);
  @Output() updateFilter: EventEmitter<any> = new EventEmitter(false);

  public form: FormGroup;
  public itemsPerPageOptions = [5, 10, 25, 50, 100];

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      searchFor: '',
      limit: 10
    });
  }

  removeCategory(category: ICategory) {
    this.categoryService.removeCategory(category).then(
      () => this.form.controls['searchFor'].reset()
    );
  }

}
