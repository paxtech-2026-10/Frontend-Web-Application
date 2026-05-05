import { Injectable } from '@angular/core';
import { BaseService} from '../../shared/services/base.service';
import { WorkerResource} from './worker.resource';
import {Worker} from '../models/worker.entity';
import {WorkerAssembler} from './worker.assembler';
import {Observable, map} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WorkerApiService extends BaseService<WorkerResource> {
  override resourceEndpoint = '/workers';

  constructor() {
    super();
  }

  public getWorkers(): Observable<Worker[]> {
    return this.getAll().pipe(
      map(response => WorkerAssembler.toEntitiesFromResponse(response)),
    )
  }
}
