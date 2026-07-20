import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@/App.css';
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import TheView from '@/pages/TheView';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';

function App() {
        return (
                <div className="App bg-ink">
                        <BrowserRouter>
                                <Routes>
                                        <Route element={<SiteLayout />}>
                                                <Route index element={<Home />} />
                                                <Route path="/about" element={<About />} />
                                                <Route path="/projects" element={<Projects />} />
                                                <Route path="/the-view" element={<TheView />} />
                                                <Route path="/gallery" element={<Gallery />} />
                                                <Route path="/contact" element={<Contact />} />
                                        </Route>
                                </Routes>
                        </BrowserRouter>
                </div>
        );
}

export default App;
