import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './page/Home';
import Subscribe from './page/Subscribe';
import List from './page/List';
import Check from './page/Check';


function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/subscribe/:cultoId" component={Subscribe} />
      <Route path="/list" component={List} />
      <Route path="/checking" component={Check} />
    </BrowserRouter>
  );
}

export default App;

// https://github.com/sinval-albuquerque/proffyProject/blob/master/web/src/pages/TeacherList/index.tsx