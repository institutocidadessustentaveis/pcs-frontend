import { MenuPagina } from './../../../model/menuPagina';

import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { MatTableDataSource, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { LinkRodapeService } from 'src/app/services/link-rodape.service';
import { Router } from '@angular/router';
import { ContatoPcsService } from 'src/app/services/contato-pcs.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NavItem } from 'src/app/model/nav-item';
import { NavItemService } from 'src/app/services/nav-item.service';
import { NavItemCombos } from 'src/app/model/navItemCombos';
import { NavItemDetalhe } from 'src/app/model/nav-itemDetalhe';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { NavItemPagina } from 'src/app/model/nav-itemPagina';
import { Title } from '@angular/platform-browser';
import { I } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-rodape',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private _transformer = (node: NavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.displayName,
      id: node.id,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  navItemSelecionado = new NavItemDetalhe();

  navItemCombos = new NavItemCombos();

  loading: boolean = false;

  scrollUp: any;

  public mostrarUrl: boolean = false;

  public navItems: NavItem[];

  public listaPaginas : MenuPagina[];

  public filteredOptions: Observable<any>;

  public checkboxUrlExterna: boolean;

  public form: FormGroup;

  public listaItem = new Array<ItemCombo>();

  public filteredOptionsItem: Observable<any>;

  public listaSubitem = new Array<ItemCombo>();

  public filteredOptionsSubitem: Observable<any>;

  public tipoNavItem = {
    ITEM: "ITEM",
    SUBITEM: "SUBITEM",
    ELEMENTO_SUBITEM: "ELEMENTO_SUBITEM"
  }

  constructor(public formBuilder: FormBuilder,
              public linkRodapeService: LinkRodapeService,
              public contatoPcsService: ContatoPcsService,
              private router: Router,
              private element: ElementRef,
              private navItemService: NavItemService,
              private titleService: Title) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle("Menu - Cidades Sustentáveis");

    this.form = this.formBuilder.group({
      pagina: [null],
      subitem: [null],
      elementoSubitem: [null] 
    });
  }

  ngOnInit() {
      this.navItemService.buscar().subscribe(async response => {
        this.navItems = response as NavItem[];
        this.dataSource.data = this.navItems;
      });


      this.navItemService.buscarNavItemCombos().subscribe(async response => {
        
        this.navItemCombos = response as NavItemCombos;
        this.listaPaginas = this.navItemCombos.paginas;

        this.filteredOptions = this.form.controls.pagina!.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.label),
          map(label => label ? this._filterPaginas(label) : this.listaPaginas.slice())
        );
      });

     this.buscarComboSubitem();
     this.buscarComboElementoSubItem();
  }

  public novo() {
    this.navItemSelecionado = new NavItemDetalhe();
    this.resetForm();
  }

  public resetForm() {
    this.form.controls.pagina.setValue('');
    this.form.controls.subitem.setValue('');
    this.form.controls.elementoSubitem.setValue('');
  }

  public salvar() {
    this.verificarRota();
    if (this.navItemSelecionado != null && this.navItemSelecionado.id != null){
      this.editar();
    } else {
      this.inserir();
      this.novo();
    }
  }


  public excluir() {
    if (this.navItemSelecionado.id !== 73) {
      this.navItemService.excluir(this.navItemSelecionado.id).subscribe(async response => {
        this.atualizaMenuVisualizacao();
        this.novo();
        await PcsUtil.swal().fire({
          title: 'Menu',
          text: `Menu item excluído`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/menu']);
        }, error => { });
      });
    } else {
      this.mensagemAlteracaoMenu();
    }

  }

  private atualizaMenuVisualizacao() {

    this.treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

    this.treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.navItemService.buscar().subscribe(async response => {
      this.navItems = response as NavItem[];
      this.dataSource.data = response;
    });
  }

  public carregarMenuItem(id: number) {
    this.navItemService.buscarNavItem(id).subscribe(async response => {
      
      this.navItemSelecionado = response as NavItemDetalhe;
      if (this.navItemSelecionado.pagina == null) {
        this.navItemSelecionado.pagina = new NavItemPagina();
      } 

      if(this.navItemSelecionado.url_name) {
        this.checkboxUrlExterna = true;
        this.mostrarUrl = !this.mostrarUrl;
      }

      if(this.navItemSelecionado.idNavItemPai) {
        const tipoItem = this.navItemSelecionado.tipoItem;
        if(tipoItem === this.tipoNavItem.SUBITEM) {
          this.filteredOptionsItem.forEach(list => {
            this.form.controls.subitem.setValue(
              list.find(item => item.id === this.navItemSelecionado.idNavItemPai)
            ); 
          });

        } else if(tipoItem === this.tipoNavItem.ELEMENTO_SUBITEM) {
          this.filteredOptionsSubitem.forEach(list => {
            this.form.controls.elementoSubitem.setValue(
              list.find(item => item.id === this.navItemSelecionado.idNavItemPai)
              );
          });
        }
      }

      if(this.navItemSelecionado.pagina) {
        this.filteredOptions.forEach(list => {
          this.form.controls.pagina.setValue(
            list.find(item => item.id === this.navItemSelecionado.pagina.idMenuPagina)
            );
        });
      }

    });
    this.element.nativeElement.scrollIntoView();
  }

  private inserir() {
    if (this.navItemSelecionado.id !== 73) {
      this.navItemService.inserir(this.navItemSelecionado).subscribe(async response => {
        this.atualizaMenuVisualizacao();
        await PcsUtil.swal().fire({
          title: 'Menu',
          text: `Menu item cadastrado`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/menu']);
        }, error => { });
      });
    } else {
      this.mensagemAlteracaoMenu();
    }
  }

  private editar() {
    if (this.navItemSelecionado.id !== 73) {
      this.navItemService.editar(this.navItemSelecionado).subscribe(async response => {
        this.atualizaMenuVisualizacao();
        await PcsUtil.swal().fire({
          title: 'Alteração do Menu Item',
          text: `Menu Item atualizado`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/menu']);
        }, error => { });
        this.router.navigate(['/menu']);
      }, error => { });
    } else {
      this.mensagemAlteracaoMenu();
    }
  }

  private mensagemAlteracaoMenu() {
    PcsUtil.swal().fire({
      title: 'Salvar/Editar/Excluir o proprio Menu de configuração',
      text: `Não permitido`,
      type: 'info',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.router.navigate(['/menu']);
    }, error => { });
  }

  changeRestrito(value: any) {
    if (!value.checked) {
      this.navItemSelecionado.idsPerfil = [];
    }
  }

  mostrarOpcaoUrl() {
    this.mostrarUrl = !this.mostrarUrl;
  }

  verificarRota() {
    if (this.mostrarUrl === true) {
      this.navItemSelecionado.pagina = null;
    } else {
      this.navItemSelecionado.url_name = null;
    }
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getLabelPagina(pagina?): string | undefined {
    return pagina ? pagina.label : undefined
  }

  getLabelItem(item?): string | undefined {
    return item ? item.label : undefined
  }

  getLabelSubitem(subitem?): string | undefined {
    return subitem ? subitem.label : undefined
  }

  private _filterPaginas(value) {
    const filterValue = value.toLowerCase();
    return this.listaPaginas.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterItem(value) {
    const filterValue = value.toLowerCase();
    return this.listaItem.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterSubitem(value) {
    const filterValue = value.toLowerCase();
    return this.listaSubitem.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  public selectPagina(pagina) {
    this.form.controls.pagina.setValue(pagina);
    this.navItemSelecionado.pagina.idMenuPagina = pagina.id;
  }

  public selectItemPai(item, tipo) {
    this.navItemSelecionado.idNavItemPai = item.id;
    if(tipo === this.tipoNavItem.SUBITEM) {
      this.form.controls.subitem.setValue(item); 
    } else if (tipo === this.tipoNavItem.ELEMENTO_SUBITEM) {
      this.form.controls.elementoSubitem.setValue(item);
    }   
  }

  public buscarComboSubitem() {
    this.navItemService.buscarNavItemPorTipoParaCombo(this.tipoNavItem.ITEM).subscribe( async res => {
      this.listaItem = res;
      this.filteredOptionsItem = this.form.controls.subitem!.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterItem(label) : this.listaItem.slice())
      );
    });
  }

  public buscarComboElementoSubItem() {
    this.navItemService.buscarNavItemPorTipoParaCombo(this.tipoNavItem.SUBITEM).subscribe( async res => {
      this.listaSubitem = res;
      this.filteredOptionsSubitem = this.form.controls.elementoSubitem!.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterSubitem(label) : this.listaSubitem.slice())
      );
    });
  }

}
