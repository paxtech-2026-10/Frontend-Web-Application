import { Component, OnInit } from '@angular/core';
import { SalonApiService } from '../../services/salon-api.service';
import {ProviderProfile} from '../../models/Salon.entity';
import {SalonItemComponent} from '../salon-item/Salon-item.component';
import {ProviderProfileAssembler} from '../../services/ProviderProfileAssembler';


@Component({
  selector: 'app-salon-list',
  imports: [
    SalonItemComponent
  ],
  templateUrl: './salon-list.component.html',
  styleUrl: './salon-list.component.css'
})
export class SalonListComponent implements OnInit {
  salons: ProviderProfile[] = [];

  constructor(private salonApiService: SalonApiService) {}

  ngOnInit(): void {
    this.salonApiService.getAll().subscribe(salons => {
      this.salons = ProviderProfileAssembler.toEntitiesfromResponse(salons);
      console.log(salons);
    });
  }
}
