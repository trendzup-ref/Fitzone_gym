import Hero from '../components/home/Hero.jsx'
import Facilities from '../components/home/Facilities.jsx'
import About from '../components/home/homeAbout.jsx'
import Trainers from '../components/home/homeTrainers.jsx'
import Footer from '../components/home/Footer.jsx'
import HomePrograms from '../components/home/HomePrograms.jsx'


const Home = () => {
  return (
    <>
    <Hero />  
    <Facilities />
    <HomePrograms/>
    <About />
    <Trainers /> 
    <Footer /> 
   </>
  )
}

export default Home