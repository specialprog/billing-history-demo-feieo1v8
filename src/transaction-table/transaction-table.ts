import { Component, Input } from '@angular/core';
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

  
  expandedTransactionId: string | null = null;

  toggleTransaction(tx: Transaction) {
    this.expandedTransactionId =
      this.expandedTransactionId === tx.id ? null : tx.id;
  }


}
