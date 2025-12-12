import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TransactionsComponent } from './transactions/transactions';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, TransactionsComponent],
  template: `
    <header>
      <app-header />
    </header>

    <main>
      <h2 class="py-4 text-xl font-bold">Transactions</h2>
      <app-transactions />
    </main>

  `,
})
export class App {
  
  ngOnInit(): void {

  }
}

bootstrapApplication(App);
