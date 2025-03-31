import { FiStar, FiHeart, FiShoppingBag, FiAward, FiDroplet, FiPackage } from 'react-icons/fi';

const About = () => {
    return (
        <div className="min-h-screen bg-cream paper-texture">            
            <div className="relative flex flex-col items-center justify-center text-soft-black p-6 md:p-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-serif mb-4 text-burgundy">
                        About Veloria
                    </h1>
                    <div className="w-24 h-1 bg-gold mx-auto mb-6" />
                    <p className="text-xl md:text-2xl text-center max-w-4xl mx-auto leading-relaxed text-soft-black/70 font-sans">
                        Where Artistry Meets Fragrance
                    </p>
                </div>

                {/* Story Section */}
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto mb-16">
                    <div className="md:w-1/2">
                        <img 
                            src="/Veloria Branding.png" 
                            alt="Veloria Perfume Crafting" 
                            className="w-full h-[400px] object-cover rounded-sm shadow-md transform hover:scale-105 transition-transform duration-300 border border-gold/10"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-serif text-burgundy mb-4">Our Story</h2>
                        <p className="text-lg text-soft-black/80 leading-relaxed font-sans">
                            Founded in 2024, Veloria emerged from a passion for creating extraordinary fragrances that tell unique stories. Our journey began with a simple vision: to transform the art of perfumery into an experience that awakens emotions and creates lasting memories.
                        </p>
                        <p className="text-lg text-soft-black/80 leading-relaxed font-sans">
                            Each fragrance is meticulously crafted by our master perfumers, who blend rare and precious ingredients from around the world to create symphonies of scent that are both timeless and contemporary.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { icon: FiStar, title: "Premium Ingredients", desc: "Sourced from the finest suppliers worldwide" },
                        { icon: FiHeart, title: "Artisan Craftsmanship", desc: "Handcrafted with passion and precision" },
                        { icon: FiShoppingBag, title: "Luxury Packaging", desc: "Elegant presentation for every bottle" },
                        { icon: FiAward, title: "Award Winning", desc: "Recognized for excellence in perfumery" },
                        { icon: FiDroplet, title: "Unique Blends", desc: "Distinctive and memorable fragrances" },
                        { icon: FiPackage, title: "Sustainable Practice", desc: "Eco-conscious production methods" }
                    ].map((feature, index) => (
                        <div key={index} className="bg-soft-white p-6 border border-gold/10 hover:border-gold/30 shadow-sm transition-all duration-300 group">
                            <feature.icon className="w-12 h-12 mb-4 text-burgundy group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-medium mb-2 text-soft-black font-serif">{feature.title}</h3>
                            <p className="text-soft-black/70">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom Quote */}
                <div className="mt-16 text-center max-w-3xl mx-auto">
                    <blockquote className="text-2xl italic font-serif text-burgundy">
                        "Every fragrance tells a story, every bottle holds a dream."
                    </blockquote>
                    <div className="mt-4 text-gold">— The Veloria Promise</div>
                </div>
            </div>
        </div>
    );
};

export default About;