import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerDetailsComponent } from './modals/player-details/player-details.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlayerDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PlayerDetailsComponent
  ]
})
export class SharedModule { }
