// model/provider.entity.ts
export class Provider {
  id: number;
  companyName: string;
  userId: number;
  constructor(){
    this.id = 0;
    this.companyName = '';
    this.userId = 0;
}
}
