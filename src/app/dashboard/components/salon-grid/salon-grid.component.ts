import { Component, OnInit } from '@angular/core';
import { SalonApiService} from '../../services/salon-api.service';
import {ProviderProfile} from '../../models/Salon.entity';
import { SalonItemComponent} from '../salon-item/Salon-item.component';
import {ProviderProfileAssembler} from '../../services/ProviderProfileAssembler';


@Component({
  selector: 'app-salon-grid',
  imports: [
    SalonItemComponent
  ],
  templateUrl: './salon-grid.component.html',
  styleUrl: './salon-grid.component.css'
})
export class SalonGridComponent implements OnInit {
  salons: ProviderProfile[] = [];

  constructor(private profileApiService: SalonApiService) {}

  ngOnInit(): void {
    this.profileApiService.getAll().subscribe(profile => {
      this.salons = ProviderProfileAssembler.toEntitiesfromResponse(profile);
      console.log(profile);
    });
  }
}
