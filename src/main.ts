import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppMainModule } from './../share-libs/src/pages/app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  
}

platformBrowserDynamic().bootstrapModule(AppMainModule)
  .catch(err => console.error(err));
