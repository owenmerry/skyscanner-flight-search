import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import LogRocket from 'logrocket';
LogRocket.init('xojxaz/owen-merry-flights');
console.log('log rocket start...');

hydrateRoot(document, <RemixBrowser />);
