
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { InstitucionalComponent } from '../views/modulo_institucional/institucional.component';
import { MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule,
   MatBadgeModule, MatMenuModule, MatButton, MatButtonModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ShareModule } from '@ngx-share/core';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { NavService } from './menu-list-item/nav.service';

@NgModule({
  declarations: [
      HeaderComponent,
      FooterComponent,
      NavComponent,
      MenuListItemComponent
    ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    ShareModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MenuListItemComponent
  ],
  providers: [NavService]
})
export class TemplateModule { }
