import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootNavigation } from './navigation/rootNavigation';
import { color } from './theme';

function App() {
  const [bgColor, setBgColor] = useState(color.background);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);
  
  return (
    <Router basename="">
      <RootNavigation />
    </Router>
  );
}

export default App;
