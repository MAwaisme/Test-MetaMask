import { ChangeDetectorRef, Component } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { MetaMaskInpageProviderOptions } from '@metamask/providers/dist/MetaMaskInpageProvider';
import { Observable } from 'rxjs';
import { MetaMaskServices } from './Services/MetaMaskServices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ethereum: MetaMaskInpageProvider

  isMetaMaskAvailable: boolean;
  isAccountConnected: boolean = false;
  accountId: string = '';
  Accounts: string[] = [];

  isConnecting: boolean = true;
  constructor(private cd: ChangeDetectorRef,
    private service: MetaMaskServices) {
    this.isMetaMaskAvailable = window.ethereum?.isMetaMask || false;
    this.ethereum = window.ethereum as MetaMaskInpageProvider;
    service.OnConnect = new Observable(subscriber => {
      this.ethereum.on('connect', () => {
        subscriber.next();
        this.isConnecting = false;
        this.cd.detectChanges();
      });
    });

    service.OnAccountChange = new Observable(subscriber => {
      this.ethereum.on('accountsChanged', async (accounts: any) => {
        console.log(accounts);
        subscriber.next(accounts);
        this.isAccountConnected = accounts.length > 0;
        this.accountId = this.isAccountConnected ? accounts.join(',') : 'No account connected.';
        this.Accounts = accounts;
        this.isConnecting = false;
        cd.detectChanges();
      });
    });

    service.OnNetworkChange = new Observable(subscriber => {
      this.ethereum.on('networkChanged', async (network: any) => {
        subscriber.next();
        console.log(network);
      });
    });

    service.OnChainChange = new Observable(subscriber => {
      this.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        subscriber.next();
        this.accountId = 'Chain is changed.';
        cd.detectChanges();
        window.location.reload();
      });
    });

    this.ethereum.on('disconnect', () => {
      console.log('disconnect')
      this.isAccountConnected = false;
      this.accountId = 'Account is disconnected.';
      cd.detectChanges();
    });

    service.OnAccountsRequested = new Observable(subscriber => {
      this.ethereum.request({ method: 'eth_accounts' }).then(s => {
        let accounts = s as Array<string>
        subscriber.next(accounts);
        this.accountId = accounts.join(',') || '';
        this.isAccountConnected = accounts.length > 0;
        this.Accounts = accounts;
        cd.detectChanges();
      });
    });
    console.log(this.ethereum);
  }
  Enable() {
    this.isConnecting = true;
    this.service.OnEnable = new Observable(subscriber => {
      this.ethereum.request({
        method: 'eth_requestAccounts'
      }).then(s => {
        let accounts = s as Array<string>
        subscriber.next(accounts);
        this.accountId = accounts.join(',') || 'Account not connected.';
        this.isAccountConnected = accounts.length > 0;
        this.Accounts = accounts;
        this.isConnecting = false;
        this.cd.detectChanges();
      });
    });
  }
}
