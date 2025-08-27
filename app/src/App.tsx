import '@assets/styles/resetStyles.scss';
import '@assets/styles/typography.scss';
import './App.css'
import FormPage from '@pages/FormPage/FormPage';
import ListPage from '@pages/ListPage/ListPage';
import { Route, Routes } from 'react-router';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

function App() {


  return (
    <>
    <Header />
    <Routes>
      <Route path="/form" element={<FormPage />} />
      <Route path="/" element={<ListPage />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
