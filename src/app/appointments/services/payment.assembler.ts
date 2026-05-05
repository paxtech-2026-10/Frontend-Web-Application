import {Payment} from '../model/payment.entity';
import {PaymentResponse} from './payment.response';

export class PaymentAssembler {
  static toEntityFromResource(resource: PaymentResponse): Payment {
    return {
      id: resource.id,
      amount: resource.amount,
      currency: resource.currency,
      status: resource.status,
    }
  }

  static toResponseFromEntity(entity: Payment): PaymentResponse {
    return {
      id: entity.id,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
    }
  }

  static toEntitiesFromResponse(resources: PaymentResponse[]): Payment[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
