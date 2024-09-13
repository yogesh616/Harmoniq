import React, { useState } from 'react';
import './AppDrawer.css'; // Link the CSS file for styling

const AppDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleDrawer} className='cursor-pointer'>App Drawer
    <div className={`app-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-handle" onClick={toggleDrawer}>
        <span className="handle-bar"></span>
      </div>
      <div className="app-list">
        <h2>App Drawer</h2>
        <ul>
          <li>App 1</li>
          <li>App 2</li>
          <li>App 3</li>
          <li>App 4</li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default AppDrawer;
