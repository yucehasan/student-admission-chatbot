import ChatScreen from './ChatScreen.tsx'
import Header from './Header.tsx'
import Home from './Home.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import ProgramScreen from './ProgramScreen.tsx';
import CampusScreen from './CampusScreen.tsx';



function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatScreen />} />
      <Route path="/programs" element={<ProgramScreen />} />
      <Route path="/campuses" element={<CampusScreen />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
