import React from 'react';
import { getFunName } from '../helpers'

class StorePicker extends React.Component {
  //allow methods in Class to reference `this`
  //---- more robust; save for methods your going to use more than once----
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // } 

  goToStore(e) {
    e.preventDefault();
    console.log('you changed the url');
    //first grab the text from the box
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);
    //transition form /store to /store/id
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  render() {
    return(
      // allow methods in Class to reference `this` via onSumbit
      //---use `this.goToStore.bind(this)` or `(e) => this.goToStore(e)`
      <form className="store-selector" onSubmit={ this.goToStore.bind(this) }>
        { /* comment */ }
        <h2>Please enter a store</h2>
        { /* ref allows a reference to a bit in a react component */ }
        <input type="text" required placeholder="Store Name" defaultValue={ getFunName() } ref={(input) => { this.storeInput = input  }} />
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

// Use `context` to pass something down globally to other components */
StorePicker.contextTypes =  {
  router: React.PropTypes.object
}

export default StorePicker;