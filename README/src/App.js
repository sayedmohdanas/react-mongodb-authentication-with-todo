import { BrowserRouter as Router,  Route,Routes, } from 'react-router-dom';
import AddUser from './screens/AddUser';
import GetUserDetails from './screens/GetUserDetails';
import Header from './component/Header';
import EditUser from './screens/EditUser';
import Login from './screens/Login';
import PrivateRoute from './component/PrivateRoute';
import LoginRoute from './component/LoginRoute';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer,  } from 'react-toastify';


function App() {
  return (
    <div>
      <Router>
      <div>
        <Header/>
        <Routes>
        <Route exact  element={ <PrivateRoute />}>
        <Route exact path="/" element={ <GetUserDetails />}/>
          <Route path="/editUser" element={<EditUser />}/>
          </Route>

          <Route exact  element={ <LoginRoute />}>
          <Route path='/login' element={<Login/>}/>
          <Route path="/register" element={<AddUser />}/>
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
    </div>
  );
}

export default App;
