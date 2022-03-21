import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { NavService } from './nav.service';
import { NavItem } from 'src/app/model/nav-item';
import { normalize } from 'path';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'] ,
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (item.route == null) {
        window.open(item.url_name);
      } else {
        window.open(item.route,"_self");
        this.navService.closeNav();
      }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  checkBold(item: NavItem): string{
    if (item.children.length  > 0) {
      return 'bold';
    }
    if ((item.route || item.url_name) && item.children.length  === 0 && item.itemPrincipal) {
      return 'bold';
    }
    if ((item.route || item.url_name) && item.children.length  === 0) {
      return 'normal';
    }
    return 'normal';

  }
}
