### requirements

1. GET method returning needed schedule data

```ts
interface GetScheduleParams {
  dataFrom: string;
  dataTo: string;
  mySchedule: boolean;
}
```

2. if userId is provided we ask enroll_microservice
3. if instructorId are provided we ask enroll_microservice
   4 we filter by danceCategory, advancementLevel, classType
