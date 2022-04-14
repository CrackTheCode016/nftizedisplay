import { Component } from '@angular/core';
import { Account, Address, NetworkType } from 'symbol-sdk';
import { Asset, AssetService } from './asset.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nftize-display';

  assets: Asset[] = [];
  totalPrice: number = 0;

  constructor(private assetService: AssetService) {
    const account = Account.generateNewAccount(NetworkType.TEST_NET);
    console.log(account);
    const address = Address.createFromRawAddress(
      'TC62UIG4FZXSVGT6FWJLARJ34XKSFVVYE34DZTQ'
    );

    assetService.viewAssetsForAccount(address).subscribe((assets) => {
      console.log(assets);
      this.assets = assets.filter((a) => !a.value.includes(','));
      this.totalPrice = this.assets
        .map((a) => parseInt(a.value))
        .reduce((a, b) => a + b);
    });
  }
}
