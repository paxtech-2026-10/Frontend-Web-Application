import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { ServiceResponse } from './service.response';
import { Service } from '../model/service.entity';
import { ServiceAssembler } from './service.assembler';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceApiService extends BaseService<ServiceResponse> {
  override resourceEndpoint = '/services';

  constructor() {
    super();
  }

  public getServices(): Observable<Service[]> {
    return this.getAll().pipe(
      map(response => ServiceAssembler.toEntitiesFromResponse(response))
    );
  }
}
