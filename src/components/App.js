import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();
    //make the addFish method available to App
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    //initial state -- getInitialState
    this.state = {
      fishes: {},
      order:  {}
    };
  }

  componentWillMount() {
    //this runs right before the app is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, 
        {
          context: this,
          state: 'fishes'
        });
    
    //check if there is anything in localstorage
    const localstorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (localstorageRef) {
      this.setState({
        order: JSON.parse(localstorageRef)
      });
    }
  }

  componentWillUnMount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    //update state
      //first - take copy of state
      const fishes = { ...this.state.fishes };
      //add in our new fish
      const timestamp = Date.now();
      fishes[`fish-${timestamp}`] = fish;
    //set state
    this.setState({ fishes: fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = this.state.fishes;
    fishes[key] = updatedFish;
    this.setState({
      fishes: fishes
    });
  }

  removeFish(key)  {
    const fishes = this.state.fishes;

    //set to `null` because of Firebase
    fishes[key] = null;
    this.setState({fishes: fishes});
  }

  loadSamples() {
    this.setState({ fishes: sampleFishes });
  }

  addToOrder(key) {
    //take copy of state
    const order = { ...this.state.order };

    //udpate or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;

    //update state
    this.setState({
      order: order}
    );
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    
    //can use `delete` because it's now bound by firebase
    delete order[key];
    this.setState({order});
  }

  render() {
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagLine="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            { Object.keys(this.state.fishes)
              .map(key =>  <Fish key={key} itemId={key} details={this.state.fishes[key]} addToOrder={ this.addToOrder } />)
            }
          </ul>
        </div>
        <Order 
          fishes={this.state.fishes} 
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
          params={this.props.params}
        />
        <Inventory 
          addFish={ this.addFish } 
          updateFish={ this.updateFish }
          removeFish={ this.removeFish }
          loadSamples={ this.loadSamples } 
          fishes={ this.state.fishes }
          storeId={ this.props.params.storeId }
           />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App