import { Component, computed, Input, signal } from '@angular/core';
import { Transaction } from '../billing/models/transaction.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-table',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './transaction-table.html',
  styleUrls: ['./transaction-table.css']
})
export class TransactionTableComponent {
  @Input() transactions: Transaction[] = [];

  selectedTransaction: Transaction | null = null;

  viewTransaction(tx: Transaction) {
    this.selectedTransaction = tx;
  }

    // Pagination signals
  pageSize = signal<number>(5);
  currentPage = signal<number>(1);

  // Compute total pages
  totalPages = computed(() =>
    Math.ceil(this.transactions.length / this.pageSize())
  );

  // Slice transactions for current page
  pagedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.transactions.slice(start, end);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  
  expandedTransactionId: string | null = null;

  toggleTransaction(tx: Transaction) {
    this.expandedTransactionId =
      this.expandedTransactionId === tx.id ? null : tx.id;
  }


}
