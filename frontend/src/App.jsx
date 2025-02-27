import ChatScreen from './ChatScreen.tsx'
import Header from './Header.tsx'
import Home from './Home.tsx'
import { BrowserRouter, Routes, Route } from "react-router";



function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatScreen />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
