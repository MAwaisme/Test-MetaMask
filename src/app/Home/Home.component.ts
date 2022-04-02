import { Component, OnInit } from '@angular/core';
import { MetaMaskServices } from '../Services/MetaMaskServices';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss']
})
export class HomeComponent implements OnInit {
  logs: string[] = []
  constructor(service: MetaMaskServices) {
    service.OnConnect.subscribe(() => {
      console.log('Connected');
      this.logs.push('Connected');
    });
    service.OnEnable.subscribe(s => {
      console.log('Enable: ', s);
      this.logs.push('Enabled');
    });
    service.OnAccountsRequested.subscribe(s => {
      console.log('Account Requested: ', s);
      this.logs.push('Account Requested');
    });
    service.OnAccountChange.subscribe(s => {
      console.log('Account Change: ', s);
      this.logs.push('Account Changed');
    });
    service.OnNetworkChange.subscribe(() => {
      console.log('Network Change');
      this.logs.push('Network Changed');
    });
    service.OnChainChange.subscribe(() => {
      console.log('Chain Change');
      this.logs.push('Chain Changed');
    });
  }

  ngOnInit() {
  }

}
