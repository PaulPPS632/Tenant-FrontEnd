import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Token } from './token';
import { UserInfo } from '../models/UserInfo';
import { enviroment } from '../enviroments/enviroment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl: string = enviroment.apiUrl;
  token: string = "";
  usuario: string = "";
  user: UserInfo = {
    id: '',
    sub: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    email: '',
    email_verified: false,
    locale: '',
    password:'',
    tenantId : '',
    tenantName:'',
    regist: false,
    tiponegocio: '',
    rol: null
  };
  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  get(url: string): any {
    const headers = new HttpHeaders({
      'tenantId': "tenan"
    });
    return this.http.get(this.apiUrl + url,{headers});
  }

  getPrivate(url: string): any {
    console.log(this.token);
    return this.http.get(this.apiUrl + url, {headers: new HttpHeaders({"Authorization": "Bearer " + this.token})});
  }

  getToken(code: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'tenantId': "tenan"
    });
    return this.http.get<Token>(this.apiUrl + "/auth/callback?code=" + code, {observe: "response", headers:headers})
      .pipe(map((response: HttpResponse<Token>) => {
        if (response.status === 200 && response.body !== null) {
          this.token = response.body.token;
          console.log(this.token);
          return true;
        } else {
          console.log("no token");
          return false;
        }
      }));
  }

  getUserInfo(url: string, user: UserInfo): Observable<UserInfo>{
    console.log("url:"+url+"token:"+this.token);
    console.log(user);
    const headers = new HttpHeaders({
      'Authorization': this.token,
      'tenantId': "tenant"
    });
    let params = new HttpParams()
      .set('id', user.id)
      .set('sub', user.sub)
      .set('name', user.name)
      .set('given_name', user.given_name)
      .set('family_name', user.family_name)
      .set('picture', user.picture)
      .set('email', user.email)
      .set('email_verified', user.email_verified.toString())
      .set('locale', user.locale)
      .set('password', user.password)
      .set('tenantId', user.tenantId)
      .set('tenantName', user.tenantName)
      .set('isRegist', user.regist)
      .set('tiponegocio', user.tiponegocio);
    return this.http.get<UserInfo>(this.apiUrl + url,{headers,params})
  }

  getLogin(email: string, password: string): any{
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    return this.http.get(this.apiUrl + "/user/login", {headers,params})
  }
}
