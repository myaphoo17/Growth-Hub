import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { ApplicationRef, enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { first, timeout } from 'rxjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    const appRef = moduleRef.injector.get(ApplicationRef);

    // Adding a longer timeout and additional debug information
    appRef.isStable
      .pipe(
        first(isStable => isStable),
        timeout(3000) // Extend timeout to 30 seconds
      )
      .subscribe({
        next: () => console.log('Application stabilized successfully.'),
        error: (err) => {
          console.error('Application did not stabilize within the timeout period:', err);
          // Additional debugging information
          console.error('Error Details:', {
            message: err.message,
            stack: err.stack,
            lastValue: err.info?.lastValue,
            meta: err.info?.meta
          });
        }
      });
  })
  .catch(err => {
    console.error('Error bootstrapping the Angular module:', err);
    // Additional debugging information
    console.error('Error Details:', {
      message: err.message,
      stack: err.stack
    });
  });
