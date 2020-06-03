import React from 'react';
import { render } from 'react-dom';
import App from './containers/App/App';
import * as Sentry from '@sentry/browser';
import packageJson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://19108c5ce65642f0aa1865cb1adf3819@sentry.io/1468903',
    release: packageJson.version,
  });
}

render(
  <App />,
  document.getElementById('root'),
);
