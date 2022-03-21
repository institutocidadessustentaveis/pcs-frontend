import { Input } from '@angular/core';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {

  static breadcrumbs: Array<Breadcrumb> = [];

  static nome: string;

  scrollUp: any;

  showEixos = false;

  @Input() nomePagina: string = '';
  @Input() isStatic: boolean = false;

  @Input()
  set fromEixos(fromEixos: boolean ){
      this.showEixos = fromEixos;
  }

  get fromEixos(){
      return this.showEixos;
  }

  public retornaLista() {
    return BreadcrumbComponent.breadcrumbs;
  };

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private element: ElementRef,
              private title: Title) {}

  ngOnInit() {
    let breadcrumb: Breadcrumb = {
      label: 'Início',
      url: '/'
    };

    this.setPageTitle();
    
    let root: ActivatedRoute = this.route.root;
    BreadcrumbComponent.breadcrumbs = this.getBreadcrumbs(root);
    BreadcrumbComponent.breadcrumbs = [breadcrumb, ...BreadcrumbComponent.breadcrumbs];
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
      if (breadcrumb.label == 'Participação Cidadã » Plano de Metas') {
        breadcrumb.label = 'Participação Cidadã » Plano de Metas';
        breadcrumb.url = '/participacao-cidada/plano-de-metas';
      }

      if (breadcrumb.label == 'Eventos » Detalhe Evento') {
        breadcrumb.label = 'Eventos » Detalhe Evento';
        breadcrumb.url = '/eventos';
      }

      if (breadcrumb.label == 'Pagina » Editor') {
        breadcrumb.label = 'Páginas';
        breadcrumb.url = '/paginas-editor/lista';
      }

      if (breadcrumb.label == 'Contribuições Acadêmicas') {
        breadcrumb.label = 'Colaborações Acadêmicas';
        breadcrumb.url = '/inicial/colaboracoes-academicas';
      }

      if (breadcrumb.label == 'Contribuições Privadas') {
        breadcrumb.label = 'Contribuições Privadas';
        breadcrumb.url = '/inicial/colaboracoes-privadas';
      }

      breadcrumbs.push(breadcrumb);
    
      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  public setPageTitle() {
    let data = this.route.data as any;

    if(data.getValue()['title']) {
      let splitTitle = data.getValue()['title'].split('»');

      if(splitTitle.length >= 2) {
        let title = `${splitTitle[1].trim()} - Cidades Sustentáveis`
        this.title.setTitle(title);
      }
    }
  }

}

export interface Breadcrumb {
  label: string;
    url: string;
}


