import {Component, OnInit} from '@angular/core';
import {ProfileHeaderComponent} from '../../components/profile-header/profile-header.component';
import {SalonProfile} from '../../models/salon-profile.entity';
import {SalonProfileApiService} from '../../services/salon-profile-api.service';
import {ProfilePortfolioComponent} from '../../components/profile-portfolio/profile-portfolio.component';
import {ReviewListComponent} from '../../components/review-list/review-list.component';
import {TranslatePipe} from '@ngx-translate/core';
import {Provider} from '../../../iam/model/provider.entity';
import {SalonProfileAssembler} from '../../services/salon-profile.assembler';

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeaderComponent, ProfilePortfolioComponent, ReviewListComponent, TranslatePipe],
  templateUrl: './profile-salon-page.component.html',
  styleUrl: './profile-salon-page.component.css'
})
export class ProfileSalonPageComponent implements OnInit {
 profile!: SalonProfile;

 constructor(private profileService: SalonProfileApiService) {}

  ngOnInit() {
    this.profileService.getProfileById(1).subscribe(profile => {
      console.log('Perfil cargado:', profile);
      this.profile = SalonProfileAssembler.toEntityFromResponse(profile);// 👈 Asegúrate que esto muestra algo
      console.log('Perfil cargado:', this.profile);
      //this.profile = profile;
    });
  }
}
