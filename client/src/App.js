import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootNavigation } from './navigation/rootNavigation';

function App() {
  return (
    <Router basename="">
      <RootNavigation />
    </Router>
  );
}

export default App;
