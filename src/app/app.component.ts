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

  constructor(private assetService: AssetService) {
    const account = Account.generateNewAccount(NetworkType.TEST_NET);
    console.log(account);
    const address = Address.createFromRawAddress(
      'TAPSLSHJJ4JDOETSYUC7SXZKAZSIPFV6KSV6SVY'
    );

    assetService.viewAssetsForAccount(address).subscribe((assets) => {
      console.log(assets);
      this.assets = assets;
    });
  }
}
