import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';




const particlesOptions = {
  particles: {
    density: {
      enable: true,
      value_area: 800,
    line_linked: {
      number: {
        value: 30,
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 1
       }}
      }
    }
  }
}

const initialstate = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'Signin',
  isSignedIn: false,   
  user: {
        id: '',
        name: '',
        email: '',
        entries: '0',
        joined: '',
  }                         
}      

class App extends Component {
  constructor() {
    super();
    this.state = initialstate;                                     
  }

loadUser = (data) => {
  this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined,
  }})
}
//checked^^^

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage'); //with inputImage
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://fathomless-coast-37547.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            input: this.state.input        
            })
          })
          .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://fathomless-coast-37547.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id          
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
        }
       this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));    
  }

  onRouteChange = (route) => {

    if (route === 'signout') {
      this.setState(initialstate)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  // after render is where you call in the imported components. The {this.state.route === 'signin' ? <signin/> : <div> ... is a ternary operator if statement}
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      
      <Particles className='particles'
      params={particlesOptions} /> 

      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
     
      { route === 'home'  
      ? <div> 
      <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries} />
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl} />
  </div>
      : (
        route=== 'Signin'
      ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
      }
    </div>
  );
  }
}

export default App;



// api key 66d414da8d32452a8fd6276aef14c0d2
// possible model key '5e026c5fae004ed4a83263ebaabec49e'
