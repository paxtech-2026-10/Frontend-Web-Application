import {Component, OnInit} from '@angular/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProviderProfile} from '../../../dashboard/models/Salon.entity';
import {ProviderProfileAssembler} from '../../../dashboard/services/ProviderProfileAssembler';
import {SalonApiService} from '../../../dashboard/services/salon-api.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import { MatInput} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-toolbar-client',
  imports: [
    LanguageSwitcherComponent,
    RouterLink,
    MatAutocomplete,
    MatOption,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    TranslatePipe
  ],
  templateUrl: './toolbar-client.component.html',
  styleUrl: './toolbar-client.component.css'
})
export class ToolbarClientComponent implements OnInit{
salones: ProviderProfile[] = [];
myControl = new FormControl();
filteredOptions: ProviderProfile[] = [];

constructor(private salonService: SalonApiService, private router: Router) {

}
ngOnInit() {
  this.salonService.getAll().subscribe(salones => {
    this.salones = ProviderProfileAssembler.toEntitiesfromResponse(salones);
    this.filteredOptions = this.salones;
    console.log('Search bar input succesfull',this.salones);
    this.myControl.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase?.() || '';
      this.filteredOptions = this.salones.filter(salon => salon.companyName.toLowerCase().includes(filterValue))
    })
  });
}

onSalonSelected(salon: ProviderProfile) {
  if(salon && salon.id) {
    this.router.navigate(['/client/homeClient/salon', salon.id]);
  }
}
}
