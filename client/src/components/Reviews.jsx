import { FiStar } from 'react-icons/fi';

const Reviews = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-4 text-red-600">What Our Customers Say</h2>
                <p className="text-gray-700 text-center mb-12 max-w-2xl mx-auto text-lg">Discover why thousands of customers love our products</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            name: "Sarah M.",
                            rating: 5,
                            comment: "Absolutely love their perfumes! The scents are long-lasting and unique.",
                            date: "2 days ago",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                        },
                        {
                            name: "John D.",
                            rating: 5,
                            comment: "Great customer service and fast delivery. Will definitely buy again!",
                            date: "1 week ago",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                        },
                        {
                            name: "Emily R.",
                            rating: 5,
                            comment: "The gift sets are perfect for special occasions. Highly recommend!",
                            date: "2 weeks ago",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
                        }
                    ].map((review, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4 border-red-500">
                            <div className="flex items-center mb-6">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-14 h-14 rounded-full mr-4 border-2 border-red-300"
                                />
                                <div>
                                    <p className="font-semibold text-lg">{review.name}</p>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={`w-6 h-6 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Reviews;