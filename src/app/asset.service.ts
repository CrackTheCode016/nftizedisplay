import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
  Address,
  KeyGenerator,
  MetadataType,
  MosaicId,
  MosaicSearchCriteria,
  RepositoryFactoryHttp,
} from 'symbol-sdk';

export enum AssetClass {
  CARD = 'CARD',
  NUMISMATIC = 'NUMISMATIC',
  DOCUMENT = 'DOCUMENT',
  LAND = 'LAND',
  OTHER = 'OTHER',
}

export interface Asset {
  name: string;
  owner: string;
  authenticty: string;
  origin: string;
  class: AssetClass;
  ownership: string;
  imageUrl: string;
  value: string;
  time: string;
  description: string;
  authentictor?: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private repositoryFactory: RepositoryFactoryHttp;

  constructor() {
    this.repositoryFactory = new RepositoryFactoryHttp(
      environment.symConfig.nodeIp
    );
  }

  // TODO: get network assets

  // getAssets(): Observable<Asset[]> {
  //   const mosaicHttp = this.repositoryFactory.createMosaicRepository();
  //   const pageNumber = 1;
  //   return mosaicHttp.search({}).pipe(
  //     mergeMap((_) => _.data),
  //     filter((_)  => _.)
  //   )
  // }

  viewAssetsForAccount(account: Address): Observable<Asset[]> {
    const metadataRepository =
      this.repositoryFactory.createMetadataRepository();
    const accountRepository = this.repositoryFactory.createAccountRepository();
    const namespaceRepository =
      this.repositoryFactory.createNamespaceRepository();

    var assetIds: string[] = [];

    return accountRepository.getAccountInfo(account).pipe(
      map((v) => {
        return v.mosaics.map((_) => _.id) as MosaicId[];
      }),
      mergeMap((_) => namespaceRepository.getMosaicsNames(_)),
      mergeMap((_) => _),
      filter((v) => v.names.length > 0 && v.names[0].name.startsWith('nftize')),
      mergeMap((_) => {
        console.log(_);
        assetIds.push(_.names[0].name);
        const searchCriteria = {
          targetId: _.mosaicId,
          metadataType: MetadataType.Mosaic,
        };
        return metadataRepository.search(searchCriteria);
      }),
      mergeMap((metadata) => metadata.data),
      filter(
        (metadata) =>
          metadata.metadataEntry.scopedMetadataKey.toHex() ===
          KeyGenerator.generateUInt64Key('NFTIZE').toHex()
      ),
      map((v, i) => {
        const asset: Asset = JSON.parse(v.metadataEntry.value);
        console.log(v.metadataEntry.value);
        if (asset.imageUrl == '')
          asset.imageUrl = '../assets/iodlt-light-transparent.png';
        asset.id = assetIds[i];
        console.log(asset);
        return asset;
      }),
      toArray()
    );
  }
}
