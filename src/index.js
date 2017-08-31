// let's go!
import React from 'react';
// curl brackets return just 1 method
import { render } from 'react-dom';

//css
import './css/style.css';

//grab the component
import StorePicker from  './components/StorePicker'

render(<StorePicker />, document.getElementById('main'));

