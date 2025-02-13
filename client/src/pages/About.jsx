const About = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500 text-white p-8">
            <h1 className="text-5xl font-bold mb-6">About Veloria</h1>
            <p className="text-lg text-center max-w-2xl mb-8">
                At Veloria Collections, we believe that every scent tells a story. Our passion for creating exquisite perfumes and fragrances is driven by our commitment to quality and artistry. 
            </p>
            <div className="flex flex-col items-center mb-8">
                <img src="/path/to/your/image.jpg" alt="Veloria Perfumes" className="w-64 h-64 object-cover rounded-full shadow-lg mb-4" />
                <p className="text-md text-center max-w-md">
                    Our team of dedicated artisans meticulously crafts each fragrance, ensuring that every bottle encapsulates the essence of elegance and sophistication.
                </p>
            </div>
            <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                    <FiStar className="w-8 h-8 mb-2" />
                    <span className="text-sm">Quality Ingredients</span>
                </div>
                <div className="flex flex-col items-center">
                    <FiHeart className="w-8 h-8 mb-2" />
                    <span className="text-sm">Passionate Craftsmanship</span>
                </div>
                <div className="flex flex-col items-center">
                    <FiShoppingBag className="w-8 h-8 mb-2" />
                    <span className="text-sm">Elegant Packaging</span>
                </div>
            </div>
        </div>
    )
}

export default About;