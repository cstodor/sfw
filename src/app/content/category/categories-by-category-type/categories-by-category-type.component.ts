import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ICategoryType } from '../../../shared/interfaces/category-type.interface';

@Component({
  selector: 'categories-by-category-type',
  templateUrl: 'categories-by-category-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesByCategoryTypeComponent implements OnChanges {

  @Input() categories: ICategory[];
  @Input() categoryTypes: ICategoryType[];

  public isDataAvailable: boolean = false;

  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: true,
      position: 'bottom'
    }
  };

  doughnutChartLabels: string[] = [];
  doughnutChartData: number[] = [];
  doughnutChartType = 'doughnut';
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }, this.globalChartOptions);

  constructor() {
  }

  ngOnChanges() {
    if (this.categories && this.categoryTypes) {
      for (let i = 0; i < this.categoryTypes.length; i++) {
        let categoryCounter: number = 0;
        for (let j = 0; j < this.categories.length; j++) {
          if (this.categories[j].assignedCategoryType === this.categoryTypes[i].id) {
            categoryCounter++;
          }
        }
        this.doughnutChartLabels.push(this.categoryTypes[i].link);
        this.doughnutChartData.push(categoryCounter);
      }
      this.isDataAvailable = true;
    }
  }

}