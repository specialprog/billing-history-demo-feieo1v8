import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { catchError, debounceTime, delay, distinctUntilChanged, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Transaction, TransactionFilters } from './models/transaction.model';
import { mockTransactions } from './models/MOCK_DATA';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private mockTransactions: Transaction[];

  allTransactions = signal(mockTransactions);

  selectedStatus = signal<string>('');
  selectedCategory = signal<string>('');
  selectedDateSort = signal<'asc' | 'desc'>('asc');

  searchText = signal<string>('');
  searchTextWithDebounce$ = toObservable(this.searchText).pipe(debounceTime(400), distinctUntilChanged());
  searchTextWithDebounce = toSignal(this.searchTextWithDebounce$, { initialValue: ''});

  isLoading = signal(false);
  error = signal('');

  filteredTransactions = computed(() => {
    const transx = this.allTransactions();
    const status = this.selectedStatus();
    const category = this.selectedCategory();
    const search = this.searchTextWithDebounce();
    const sort = this.selectedDateSort();

    let filtered: Transaction[] = [...transx];

    if (status) {
      filtered = filtered.filter((t: Transaction) => t.status === status);
    }

    if (category) {
      filtered = filtered.filter((t: Transaction) => t.category === category);
    }

    if(search) {
      filtered = filtered.filter((t: Transaction) => t.description.toLocaleLowerCase().includes(search.toLowerCase()));
    }

    filtered = filtered.sort(this.compareValues<Transaction>('date', sort))

    return filtered;
  })

  filteredTransactions$ = toObservable(this.filteredTransactions).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(transx => 
      of(transx).pipe(
        delay(1500) // simulate async delay
      )
      // { return throwError(() => new Error('An error occurred!')); }
    ),
    tap(() => this.isLoading.set(false)),
    finalize(() => this.isLoading.set(false)),
    catchError(err => {
      this.error.set(err.message);
      return of([]);
    }),
  );

  filteredTransactionsDelayed = toSignal(this.filteredTransactions$, { initialValue: []});
  
  disableSort = linkedSignal({
    source: this.filteredTransactionsDelayed,
    computation: (src) => src.length < 2
  });

  constructor() {
    this.mockTransactions = mockTransactions;
  }

  /**
   * Returns all transactions with optional filtering
   * @param filters Optional filters to apply
   * @returns Observable of filtered transactions
   */
  public getTransactions(filters?: TransactionFilters): Observable<Transaction[]> {
    // TODO: Implement filtering logic
    // Use RxJS operators to:
    // 1. Filter transactions based on provided criteria
    // 2. Add artificial delay using delay() operator
    // 3. Handle empty results

    return of(this.mockTransactions).pipe(
      delay(2000),
      map((transx: Transaction[]) => this.filterByCriteria(transx, filters))
    );
  }

  uniqueCategories = this.getUniqueValues(mockTransactions, 'category') as string[];
  allCategories = signal<string[]>(this.uniqueCategories.sort());

  readonly filteredTransactionsResource = rxResource({
    stream: () => this.filteredTransactions$,
    defaultValue: []
  })

  /**
   * Fetches details for a specific transaction
   * @param id Transaction ID
   * @returns Promise with transaction details
   */
  public getTransactionDetails(id: string): Promise<Transaction> {
    // TODO: Implement promise-based detail fetching
    // 1. Find transaction by ID
    // 2. Add artificial delay
    // 3. Handle not found case
    return this.getTransactionById(id, 3000);
  }

  /**
   * Searches transactions by description
   * @param query Search query
   * @returns Observable of matching transactions
   */
  public searchTransactions(query: string): Observable<Transaction[]> {
    // TODO: Implement search logic
    // Use RxJS operators to:
    // 1. Filter transactions by description
    // 2. Add debounce time
    // 3. Handle case-insensitive search
    return of([])
  }

  private filterByCriteria<T extends Record<string, any>>(
    items: T[],
    criteria?: Partial<Record<keyof T, string | number>>
  ): T[] {
    if (!criteria || Object.keys(criteria).length === 0) {
      return items;
    }
  
    return items.filter(item =>
      Object.entries(criteria).every(([key, value]) => {
        const itemValue = item[key as keyof T];
  
        // Case-insensitive match for strings
        if (typeof itemValue === "string" && typeof value === "string") {
          return itemValue.toLowerCase() === value.toLowerCase();
        }
  
        // Strict equality for numbers or other types
        return itemValue === value;
      })
    );
  }

  private async getTransactionById(id: string, delayMs?:  number): Promise<Transaction> {
    // Add artificial delay
    if (delayMs) {
      await this.delay(delayMs);
    }
  
    const transaction = mockTransactions.find(tx => tx.id === id);
  
    if (transaction) {
      return transaction;
    } else {
      throw new Error(`Transaction with id "${id}" not found.`);
    }
  }
  
  // Utility delay function
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getUniqueValues<T extends Record<string, any>>(arr: T[], key: keyof T): T[keyof T][] {
    const seen = new Set<T[keyof T]>();
    for (const item of arr) {
      if (item[key] !== undefined) {
        seen.add(item[key]);
      }
    }
    return Array.from(seen);
  }
  
  private compareValues<T>(propertyPath: string, order: 'asc' | 'desc' = 'asc') {
    return function<T>(a: any, b: any) {
  
      const getValue = (obj: any, path: string): any => {
        return path.split('.').reduce((value, key) => value[key], obj);
      };
  
      const valueA = getValue(a, propertyPath);
      const valueB = getValue(b, propertyPath);
  
  
      let varA!: any;
      let varB!: any;
  
      const possibleDateA = new Date(valueA).toString();
      const possibleDateB = new Date(valueB).toString();
  
      if (possibleDateA !== 'Invalid Date' && possibleDateB !== 'Invalid Date') {
        varA = new Date(valueA);
        varB = new Date(valueB);
      } else if (!isNaN(valueA) && !isNaN(valueB)) {
        varA = +valueA;
        varB = +valueB;
      } else  {
        varA = valueA.toLocaleLowerCase();
        varB = valueB.toLocaleLowerCase();
      }
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (order === 'desc') ? (comparison * -1) : comparison;
    };
  }

}
