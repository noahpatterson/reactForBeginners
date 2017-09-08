import React from 'react';
import AddFishForm from './AddFishForm'
import base from '../base'

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange    = this.handleChange.bind(this);
    this.renderLogin    = this.renderLogin.bind(this);
    this.authenticate    = this.authenticate.bind(this);
    this.authHandler    = this.authHandler.bind(this);
    this.logout    = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    };
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, {user});
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    
    //take copy of fish and update with new data
    const newFish = {
      ...fish,
      [e.target.name]: e.target.value
    }

    this.props.updateFish(key, newFish);
  }

  renderLogin() {
     return (
        <nav className="login">
          <h2>Inventory</h2>
          <p>Sign in to manage stores inventor</p>
          <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
          <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
          <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
        </nav>
     )
  }

  logout() {
    base.unauth();
    this.setState({
      uid: null
    })
  }

  authenticate(provider) {
    console.log(`tring to login with ${provider} `)
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);
    if (err) {
      console.error(err);
      return;
    }

    //grab store info
     const storeRef = base.database().ref(this.props.storeId);

     //query the firebase once for the store data
     storeRef.once('value', (snapshot) => {
        const data = snapshot.val() || {};

        //claim if there no owner already
        if (!data.owner) {
          storeRef.set({
            owner: authData.user.uid
          });
        }

        this.setState({
          uid: authData.user.uid,
          owner: data.owner || authData.user.uid
        })
     });
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    
    return(
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={ (e) => this.handleChange(e, key) } />
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={ (e) => this.handleChange(e, key) } />
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={ (e) => this.handleChange(e, key) }>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={ (e) => this.handleChange(e, key) }></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={ (e) => this.handleChange(e, key) } />
        <button onClick={ () => this.props.removeFish(key) }>Remove Fish</button>
      </div>
    );
  }

  render() {
    const logout = <button onClick={() => this.logout()}>Logout</button>
    //checked if they are not logged in at all
    if (!this.state.uid) {
      return(
        <div>{this.renderLogin()}</div>
      )
    }

    //check if they are the owner of the current store
    if (this.state.uid !== this.state.owner){
      return(
        <div>
          <p>Sorry you are not the owner of the store</p>
          {logout}
        </div>
      )
    }

    return(
      <div>
        <h2>Inventory</h2>
        {logout}
        <AddFishForm addFish={ this.props.addFish } />
        <button onClick={ this.props.loadSamples }>Add Sample Fishes</button>
        { Object.keys(this.props.fishes).map(this.renderInventory) }
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
}

export default Inventory;