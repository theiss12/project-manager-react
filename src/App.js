import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectsProvider from './providers/ProjectsProvider';
import Home from './screens/Home';
import Editor from './screens/Editor';

function App() {

  return (
    <div className="App">
      <ProjectsProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path='/editor/:slug' element={<Editor />}></Route>
          </Routes>
        </BrowserRouter>
      </ProjectsProvider>
    </div>
  );
}

export default App;
