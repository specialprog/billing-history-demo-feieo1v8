import { Component, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { BillingService } from "../billing/billing.service";

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {

  private billingService = inject(BillingService);
  
  selectedStatus = this.billingService.selectedStatus;
  selectedCategory = this.billingService.selectedCategory;
  searchText = this.billingService.searchText;
  selectedDateSort = this.billingService.selectedDateSort;

  disableSort = this.billingService.disableSort;

  categories = this.billingService.allCategories;

}