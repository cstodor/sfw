import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ICategory } from '../../../../shared/interfaces/category.interface';
import { ILocation } from '../../../../shared/interfaces/location.interface';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'locations-by-category',
  templateUrl: './locations-by-category.component.html',
  styleUrls: ['./locations-by-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsByCategoryComponent implements OnChanges, OnDestroy {

  @Input() categories: ICategory[];
  @Input() locations: ILocation[];

  public isDataAvailable: boolean = false;
  private categorySubscription: ISubscription;

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

  constructor(private categoryService: CategoryService) {
    this.categorySubscription = categoryService.getCategoriesByCategoryType('location.types').subscribe(
      (categories: ICategory[]) => this.categories = categories
    )
  }

  ngOnChanges() {
    if (this.categories && this.locations) {
      for (let i = 0; i < this.categories.length; i++) {

        let locationCounter: number = 0;
        for (let j = 0; j < this.locations.length; j++) {
          if (this.locations[j].assignedCategory === this.categories[i].id) {
            locationCounter++;
          }
        }
        this.doughnutChartLabels.push(this.categories[i].title);
        this.doughnutChartData.push(locationCounter);
      }
      this.isDataAvailable = true;
    }
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
  }

}
