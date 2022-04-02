import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MetaMaskServices {
    public OnEnable: Observable<string[]> = new Observable();
    public OnConnect: Observable<void> = new Observable();
    public OnAccountChange: Observable<string[]> = new Observable();
    public OnNetworkChange: Observable<void> = new Observable();
    public OnChainChange: Observable<void> = new Observable();
    public OnAccountsRequested: Observable<string[]> = new Observable();
}