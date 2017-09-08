// let's go!
import React from 'react';
// curl brackets return just 1 method
import { render } from 'react-dom';

//react router
import { BrowserRouter, Match, Miss } from 'react-router'

//css
import './css/style.css';

//grab the component
import StorePicker from  './components/StorePicker'
import NotFound from './components/NotFound'
import App from './components/App'

//const repo = `/${window.location.pathname.split('/')[1] }`;
//routes
const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={StorePicker} />
        <Match pattern="/store/:storeId" component={App} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

render(<Root />, document.getElementById('main'));

