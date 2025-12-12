import { TestBed } from '@angular/core/testing';
import { BillingService } from './billing.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { Transaction } from './models/transaction.model';

describe('BillingService', () => {
  let service: BillingService;

  // Sample mock transactions
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-01',
      amount: 100,
      status: 'successful',
      description: 'Payment for invoice #123',
      category: 'utilities',
      paymentMethod: 'credit card'
    },
    {
      id: '2',
      date: '2025-01-02',
      amount: 200,
      status: 'failed',
      description: 'Payment for invoice #456',
      category: 'rent',
      paymentMethod: 'bank transfer'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingService]
    });
    service = TestBed.inject(BillingService);

    // Override the service’s mockTransactions for testing
    (service as any).mockTransactions = mockTransactions;
  });

  it('should filter transactions by status', fakeAsync(() => {
    let result: Transaction[] = [];

    service.getTransactions({ status: 'successful' }).subscribe(transactions => {
      result = transactions;
    });

    // Simulate the artificial delay in getTransactions (2000ms)
    tick(2000);

    expect(result.length).toBe(1);
    expect(result[0].status).toBe('successful');
    expect(result[0].id).toBe('1');
  }));
});

/* tslint:disable:no-unused-variable */

// import { TestBed, inject } from '@angular/core/testing';
// import { BillingService } from './billing.service';

// describe('BillingService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [BillingService]
//     });
//   });

//   it('should ...', inject([BillingService], (service: BillingService) => {
//     expect(service).toBeTruthy();
//   }));
// });