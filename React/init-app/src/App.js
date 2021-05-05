import './App.css';
import List from './list'
import { Provider } from 'react-redux'
import store from './store'

const Fa = (
  <Provider store={store}>
    <List></List>
  </Provider>
)

function App() {
  return (
    <Fa/>
  );
}

export default App;
