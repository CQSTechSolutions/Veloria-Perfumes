import React from 'react';
import PolicyPage from '../components/common/PolicyPage';

const ShippingPolicy = () => {
  const sections = [
    {
      title: "1. Shipping Information",
      content: (
        <>
          <p>
            At Veloria Perfumes, we strive to ensure your precious fragrances arrive safely and promptly. We offer various shipping options to accommodate your needs, and we ship to most countries worldwide.
          </p>
          <p className="mt-2">
            Please note that delivery timeframes may vary depending on your location, shipping method, and any customs processing requirements for international orders.
          </p>
        </>
      )
    },
    {
      title: "2. Processing Time",
      content: (
        <>
          <p>
            All orders are processed within 1-2 business days (Monday through Friday, excluding holidays) from the time of purchase. Orders placed on weekends or holidays will be processed on the next business day.
          </p>
          <p className="mt-2">
            During peak seasons or promotional periods, processing times may be slightly longer. If there are significant delays, we will communicate this information to you via email.
          </p>
        </>
      )
    },
    {
      title: "3. Domestic Shipping (Within India)",
      content: (
        <>
          <p>We offer the following shipping options for domestic orders:</p>
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="bg-cream/50">
                <th className="border border-gold/20 p-2 text-left">Shipping Method</th>
                <th className="border border-gold/20 p-2 text-left">Estimated Delivery Time</th>
                <th className="border border-gold/20 p-2 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gold/20 p-2">Standard Shipping</td>
                <td className="border border-gold/20 p-2">3-5 business days</td>
                <td className="border border-gold/20 p-2">₹99 (Free for orders above ₹1,500)</td>
              </tr>
              <tr>
                <td className="border border-gold/20 p-2">Express Shipping</td>
                <td className="border border-gold/20 p-2">1-2 business days</td>
                <td className="border border-gold/20 p-2">₹199</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2">
            Delivery timeframes are estimates and are not guaranteed. Delays may occur due to weather conditions, holidays, or other unforeseen circumstances.
          </p>
        </>
      )
    },
    {
      title: "4. International Shipping",
      content: (
        <>
          <p>We ship to most countries worldwide through the following options:</p>
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="bg-cream/50">
                <th className="border border-gold/20 p-2 text-left">Shipping Method</th>
                <th className="border border-gold/20 p-2 text-left">Estimated Delivery Time</th>
                <th className="border border-gold/20 p-2 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gold/20 p-2">Standard International</td>
                <td className="border border-gold/20 p-2">7-14 business days</td>
                <td className="border border-gold/20 p-2">₹999 (Free for orders above ₹5,000)</td>
              </tr>
              <tr>
                <td className="border border-gold/20 p-2">Express International</td>
                <td className="border border-gold/20 p-2">3-5 business days</td>
                <td className="border border-gold/20 p-2">₹1,999</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2">
            Please note that international shipping times may vary significantly depending on the destination country, customs processing, and local delivery services.
          </p>
        </>
      )
    },
    {
      title: "5. Shipping Restrictions",
      content: (
        <>
          <p>
            Due to regulations regarding the transportation of fragrances, which contain alcohol, there may be restrictions on shipping to certain countries. Additionally, some countries have import restrictions on beauty and cosmetic products.
          </p>
          <p className="mt-2">
            If we are unable to ship to your country, you will be notified during the checkout process. Please contact customer service if you have any questions about shipping to your location.
          </p>
        </>
      )
    },
    {
      title: "6. Customs, Duties, and Taxes",
      content: (
        <>
          <p>
            International orders may be subject to customs duties and taxes imposed by the destination country. These charges are the responsibility of the recipient and are not included in the purchase price or shipping cost.
          </p>
          <p className="mt-2">
            Veloria Perfumes has no control over these charges and cannot predict their amount. Customs policies vary by country, so please contact your local customs office for more information.
          </p>
        </>
      )
    },
    {
      title: "7. Tracking Information",
      content: (
        <>
          <p>
            Once your order ships, you will receive a confirmation email with tracking information. You can track your package using the tracking number provided or by logging into your Veloria Perfumes account.
          </p>
          <p className="mt-2">
            If you haven't received your tracking information within 2 business days of your order being processed, please check your spam folder before contacting customer service.
          </p>
        </>
      )
    },
    {
      title: "8. Shipping Address",
      content: (
        <>
          <p>
            It is the customer's responsibility to provide accurate shipping information. We cannot be held responsible for packages delivered to an incorrect address due to customer error.
          </p>
          <p className="mt-2">
            If you need to change your shipping address after placing an order, please contact us immediately. We will try to accommodate your request, but once an order has been shipped, we cannot change the delivery address.
          </p>
        </>
      )
    },
    {
      title: "9. Package Handling and Delivery",
      content: (
        <>
          <p>
            Fragrance products require special handling. We package all orders with extreme care to prevent damage during transit. All perfumes are securely wrapped and cushioned to minimize the risk of breakage.
          </p>
          <p className="mt-2">
            Orders may require a signature upon delivery, especially for high-value purchases. If no one is available to sign for the package, the delivery service will leave a notice with instructions for rescheduling or pickup.
          </p>
        </>
      )
    },
    {
      title: "10. Lost or Damaged Packages",
      content: (
        <>
          <p>
            If your package appears to be lost or damaged during transit, please contact us within 7 days of the expected delivery date. We will work with the shipping carrier to locate your package or process a claim.
          </p>
          <p className="mt-2">
            For packages damaged during transit, please take photos of the damaged packaging and contents before disposing of any materials, as these may be required for the claims process.
          </p>
        </>
      )
    },
    {
      title: "11. Contact Us",
      content: (
        <>
          <p>
            If you have any questions about our shipping policy or need assistance tracking your order, please contact our customer service team:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: shipping@veloriaperfumes.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Customer Service Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <PolicyPage
      title="Shipping Policy"
      subtitle="Information about our shipping methods, timeframes, and costs"
      sections={sections}
    />
  );
};

export default ShippingPolicy; 