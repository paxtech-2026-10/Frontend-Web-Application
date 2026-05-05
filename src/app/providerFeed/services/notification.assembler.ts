import {Notifications} from '../model/notifications.entity';
import {NotificationResource} from './notification.resource';
export class NotificationAssembler {
  static toEntityFromResource(resource: NotificationResource):Notifications {
    return {
      id: resource.id,
      notificationDate: resource.notificationDate,
      message: resource.message,
      salonId: resource.salonId,
      clientId: resource.clientId,
      iconURL: resource.iconURL,
      read: resource.read
    }
  }
  static toEntitiesFromResponse(resources: NotificationResource[]): Notifications[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
