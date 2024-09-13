import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/usuario/account.service';

@Component({
  selector: 'app-redirectaccountgoogle',
  templateUrl: './redirectaccountgoogle.component.html',
  styleUrls: ['./redirectaccountgoogle.component.scss']
})
export class RedirectaccountgoogleComponent {
  url: string = "";

  constructor(private http: AccountService, private cookiesService: CookieService) {}

  ngOnInit(): void {
    this.cookiesService.set('tenantId', 'predeterminado');
    this.http.get("/auth/url").subscribe((data: any) => this.url = data.authURL);
  }

}
