import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';


import Home from './page/Home';
import Subscribe from './page/Subscribe';


function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/subscribe" component={Subscribe} />
    </BrowserRouter>
  );
}

export default App;
