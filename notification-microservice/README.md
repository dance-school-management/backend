Push notifications data formats:

1) Cancelled class: 
```json
{
  "event": "CANCELLED_CLASS",
  "classId": 1
}
```

2) Postponed class: 
```json
{
  "event": "POSTPONED_CLASS",
  "classId": 1
}
```

Notification microservice is used to send notifications (save them in database and retrieve with REST) and send push notifications to user's mobile devices. For now it has no authorization, because it was actually forgotten to implement, but maybe it will make development easier for now :)

It enables users to either register only for "notifications" and not for "push notifications" or both of them.

GET /notification/status returns three things:

isRegistered: boolean - if the user's id is in the notification-microservice's database, if he has ever registered for notifications
hasEnabledNotifications: boolean - if the user has enabled notifications (they can toggle notifications with /notification/toggle). if the user has enabled notifications, newly created notifications that are supposed to be assigned to them, are assigned to them, and, if the user is registered for push notifications, they are sent to their registered device. if the user has disabled notifications, newly created notifications are not assigned to them in the database and no push notifications are sent to them (so when they enable notifications later, the notifications that were supposed to be assigned to them when they had notifications disabled, won't be available for them after they enable notifications)
isRegisteredForPushNotifications: boolean - if their expo push token is valid and they have enabled notifications (refers to "2)"), otherwise it is false
POST /notification/register can either have a push token in the body or not. if there's no push token specified, the user will only be registered for "normal notifications", not push notifications. important: user can invoke this endpoint at any time with a new push token to update it

to unregister from push notifications, user can use endpoint PUT /notification/push/unregister

GET /notification and GET /notification/id retrieve only the current logged in user's notifications

POST /notification creates a notification with title and body, but no data/payload

what is data/payload:
it is data of type Record<string, unknown> sent to the mobile app with the push notification and returned in the GET /notification and GET /notification/id endpoints. it can be used to redirect the user to the appriorate page when they click/press the notification. possible payloads are documented in /backend/notification-microservice/README.md

notifications with data/payload are created when invoking /cms/cancel/class or /cms/postpone/class endpoints in product microservice

the rest of the things should probably be obvious