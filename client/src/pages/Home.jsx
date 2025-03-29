import Navbar from "../components/Navbar"
import Carousel from "../components/Carousel"
import SearchBar from "../components/SearchBar"
import CategorySection from "../components/CategorySection"
import BestSellers from "../components/BestSellers"
import FeaturedProducts from "../components/FeaturedProducts"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"

const Home = () => {
    return (
        <>
            <Navbar/>
            <Carousel/>
            <SearchBar/>
            <CategorySection/>
            <BestSellers/>
            <FeaturedProducts/>
            <Newsletter/>
            <Footer/>
        </>
    );
}

export default Home;