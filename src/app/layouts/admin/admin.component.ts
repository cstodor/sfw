import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MenuItemsService } from '../../shared/services/menu/menu-items.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {

  private _router: Subscription;

  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  today: number = Date.now();
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  currentLang = 'en';
  dir = 'ltr';
  sidePanelOpened;
  user;

  @ViewChild('sidemenu') sidemenu;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(private router: Router,
    public menuItems: MenuItemsService,
    private translate: TranslateService,
    public authService: AuthService,
    private zone: NgZone) {

    translate.addLangs(['de', 'en', 'fr']);
    translate.setDefaultLang('de');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'de');

    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = mql;
    }));
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
      this.url = event.url;
      this.runOnRouteChange();
    });
  }

  ngOnDestroy(): void {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return this.mediaMatcher.matches;
    }
  }

  menuMouseOver(): void {
    if (this.mediaMatcher.matches && this.collapseSidebar) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (this.mediaMatcher.matches && this.collapseSidebar) {
      this.sidemenu.mode = 'side';
    }
  }

  updatePS(): void {
    if (!this.mediaMatcher.matches && !this.compactSidebar) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, 350);
    }
  }

  signOut(): void {
    this.authService.signOut().then(
      () => this.router.navigate(['/login']),
      (error: any) => console.log(error));
  }
}
