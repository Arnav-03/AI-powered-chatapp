import React, { useContext } from 'react'
import Register from './Register'
import { UserContext } from './UserContext'
import Chat from './Chat';
import Home from './Home';

const Routes = () => {
    const {username,id}= useContext(UserContext);
    if(username){
        return <Chat />;
    }
  return (
/*     <Register />
 */ 
      <Home/>
 )
}
export default Routes
