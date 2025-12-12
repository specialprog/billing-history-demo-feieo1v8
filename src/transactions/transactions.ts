import { Component, inject, input, output } from '@angular/core';
import { Transaction } from '../billing/models/transaction.model';
import { BillingService } from '../billing/billing.service';
import { TransactionTableComponent } from '../transaction-table/transaction-table';

@Component({
  selector: 'app-transactions',
  imports: [TransactionTableComponent],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent {

  private billingService = inject(BillingService);

  transactions = this.billingService.filteredTransactions;
  isLoading = this.billingService.isLoading;
  error = this.billingService.error;
}