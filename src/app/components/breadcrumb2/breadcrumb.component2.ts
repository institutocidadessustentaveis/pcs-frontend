import { Input } from '@angular/core';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb2',
  templateUrl: './breadcrumb.component2.html',
  styleUrls: ['./breadcrumb.component2.scss']
})

export class BreadcrumbComponent2 implements OnInit {

  static breadcrumbs: Array<Breadcrumb> = [];

  static nome: string;

  scrollUp: any;

  @Input() nomePagina: string = '';
  @Input() isStatic: boolean = false;

  public retornaLista() {
    return BreadcrumbComponent2.breadcrumbs;
  };

  /**
  /*.filter(event => event instanceof NavigationEnd)
 .distinctUntilChanged()
 .map(event =>  this.buildBreadCrumb(this.activatedRoute.root)); */

  constructor(private router: Router, private route: ActivatedRoute, private element: ElementRef) {
   }
  ngOnInit() {
    let breadcrumb: Breadcrumb = {
      label: 'Início',
      url: '/'
    };

    let root: ActivatedRoute = this.route.root;
    BreadcrumbComponent2.breadcrumbs = this.getBreadcrumbs(root);
    BreadcrumbComponent2.breadcrumbs = [breadcrumb, ...BreadcrumbComponent2.breadcrumbs];


  //   this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
  //     //set breadcrumbs
  //     let root: ActivatedRoute = this.route.root;
  //     BreadcrumbComponent.breadcrumbs = this.getBreadcrumbs(root);
  //     BreadcrumbComponent.breadcrumbs = [breadcrumb, ...BreadcrumbComponent.breadcrumbs];
  //   });
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'title';
    //get the child routes
    let children: ActivatedRoute[] = route.children;
    let nome = this.route.data;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;

    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length === 0) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');



      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: Breadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: url
      };
      if (breadcrumb.label == 'Indicador » Indicadores') {
        breadcrumb.label = 'Indicador » Indicadores';
        breadcrumb.url = '/indicadores';
      }
      if (breadcrumb.label == 'Notícias » Notícias') {
        breadcrumb.label = 'Notícias';
        breadcrumb.url = '/noticias';
      }

      if (breadcrumb.label == 'Boas Práticas » Detalhes') {
        breadcrumb.label = 'Boas Práticas » Detalhes';
        breadcrumb.url = '/boas-praticas';
      }

      
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

}

export interface Breadcrumb {
  label: string;
    url: string;
}


