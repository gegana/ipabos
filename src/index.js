import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Home from './Home';
import 'antd/dist/antd.css';

render(
  <Home />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
