import {TimeSlotResponse} from './time-slot.response';
import {TimeSlot} from '../model/time-slot.entity';

export class TimeSlotAssembler {
  static toEntityFromResource(resource: TimeSlotResponse): TimeSlot {
    return {
      id: resource.id,
      startTime: resource.startTime,
      endTime: resource.endTime,
      status: resource.status,
      type: resource.type
    };
  }
  static toEntitiesFromResponse(resources: TimeSlotResponse[]): TimeSlot[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
