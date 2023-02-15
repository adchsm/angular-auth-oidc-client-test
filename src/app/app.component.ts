import { Component } from '@angular/core';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { format, fromUnixTime } from 'date-fns';
import { map, Observable, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected isAuthenticated$: Observable<boolean> =
    this.oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => isAuthenticated)
    );

  protected userData$: Observable<UserDataResult> =
    this.oidcSecurityService.userData$;

  protected tokenExpiryTime: string | null = null;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  public ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .pipe(take(1))
      .subscribe((result) => {
        console.log('checkAuth:', result);
        this.obtainIdTokenExpiryTime();
      });
  }

  private obtainIdTokenExpiryTime(): void {
    this.oidcSecurityService
      .getPayloadFromIdToken()
      .pipe(take(1))
      .subscribe((jwt: any) => {
        this.tokenExpiryTime = format(fromUnixTime(jwt.exp), 'PPpp');
      });
  }

  protected handleSignInClick(): void {
    this.oidcSecurityService.authorize();
  }

  protected handleSignOutClick(): void {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log('logoff:', result));
  }
}
