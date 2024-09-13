import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/usuario/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private isRegisteringSource = new BehaviorSubject<boolean>(false);
  isRegistering$ = this.isRegisteringSource.asObservable();

  constructor(private http: AccountService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.authenticate(params['code']);
      }
    });
  }

  private authenticate(code: string) {
    this.http.getToken(code).subscribe(result => {
      this.isAuthenticated.next(result);
    });
  }

  setIsRegistering(value: boolean) {
    this.isRegisteringSource.next(value);
  }
  
}