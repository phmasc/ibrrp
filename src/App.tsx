import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './page/Home';
import Subscribe from './page/Subscribe';


function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/subscribe/:cultoId" component={Subscribe} />
    </BrowserRouter>
  );
}

export default App;

// https://github.com/sinval-albuquerque/proffyProject/blob/master/web/src/pages/TeacherList/index.tsx