import React from 'react';
import PolicyPage from '../components/common/PolicyPage';

const ReturnPolicy = () => {
  const sections = [
    {
      title: "1. Return Policy Overview",
      content: (
        <>
          <p>
            At Veloria Perfumes, we want you to be completely satisfied with your purchase. We understand that sometimes a product may not meet your expectations, which is why we offer a straightforward return policy.
          </p>
          <p className="mt-2">
            This policy outlines the terms and conditions for returning products purchased from our website or authorized retailers.
          </p>
        </>
      )
    },
    {
      title: "2. Return Eligibility",
      content: (
        <>
          <p>You may return your purchase if:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>The item is unused, unopened, and in its original packaging</li>
            <li>The return is initiated within 30 days of delivery</li>
            <li>You have a valid proof of purchase (order confirmation or receipt)</li>
            <li>The product is not part of our "Final Sale" category</li>
          </ul>
          <p className="mt-4">The following items are not eligible for return:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Sample sets and individual samples</li>
            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            <li>Products that have been opened, used, or had their seals broken</li>
            <li>Custom or personalized fragrances</li>
            <li>Gift cards</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Return Process",
      content: (
        <>
          <p>To initiate a return, please follow these steps:</p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>
              <strong>Contact Customer Service:</strong> Email us at returns@veloriaperfumes.com or call +1 (555) 123-4567 within 30 days of receiving your order. Please include your order number and the reason for the return.
            </li>
            <li>
              <strong>Obtain a Return Authorization (RA) Number:</strong> We will provide you with an RA number, which must be included with your return.
            </li>
            <li>
              <strong>Package Your Return:</strong> Securely pack the unused, unopened item(s) in their original packaging. Include the RA number and a copy of your invoice or packing slip.
            </li>
            <li>
              <strong>Ship Your Return:</strong> Send your package to the address provided in your return authorization email. We recommend using a trackable shipping method for your protection.
            </li>
          </ol>
        </>
      )
    },
    {
      title: "4. Refunds",
      content: (
        <>
          <p>
            Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed within 7-10 business days.
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Original Payment Method:</strong> Refunds will be issued to the original payment method used for the purchase.
            </li>
            <li>
              <strong>Credit Card Refunds:</strong> Credit card refunds may take an additional 3-5 business days to appear on your statement, depending on your financial institution.
            </li>
            <li>
              <strong>Store Credit:</strong> In some cases, such as returns without a receipt or returns beyond 30 days (but within 45 days), we may issue store credit instead of a refund to the original payment method.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "5. Exchanges",
      content: (
        <>
          <p>
            We offer exchanges for unopened products within 30 days of delivery. To request an exchange:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Follow the same process as returns to obtain an RA number.</li>
            <li>Specify that you want an exchange and indicate the product you would like instead.</li>
            <li>If the exchange item has a different price, we will either:
              <ul className="list-disc pl-6 mt-1">
                <li>Charge the difference if the new item costs more</li>
                <li>Refund the difference if the new item costs less</li>
              </ul>
            </li>
          </ol>
        </>
      )
    },
    {
      title: "6. Damaged or Defective Items",
      content: (
        <>
          <p>
            If you receive a damaged or defective product:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Contact customer service within 7 days of receiving your order.</li>
            <li>Provide photos of the damaged item and packaging, if possible.</li>
            <li>We will arrange for a replacement or refund, and provide instructions for returning the damaged item if necessary.</li>
          </ol>
          <p className="mt-2">
            Shipping costs for returning damaged or defective items will be covered by Veloria Perfumes.
          </p>
        </>
      )
    },
    {
      title: "7. Return Shipping Costs",
      content: (
        <>
          <p>
            Customers are responsible for return shipping costs unless the return is due to our error (e.g., you received an incorrect or defective item).
          </p>
          <p className="mt-2">
            Original shipping charges are non-refundable unless the return is due to our error. Shipping costs for expedited shipping methods are not refundable.
          </p>
        </>
      )
    },
    {
      title: "8. International Returns",
      content: (
        <>
          <p>
            International customers are eligible for returns under the same conditions as domestic customers. However, please note the following:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Return shipping costs are the responsibility of the customer.</li>
            <li>Customs fees, import duties, and taxes paid during the initial shipment are non-refundable.</li>
            <li>Please mark the package as a "Return of Merchandise" to avoid additional customs charges.</li>
            <li>International returns may take longer to process due to shipping and customs delays.</li>
          </ul>
        </>
      )
    },
    {
      title: "9. Gift Returns",
      content: (
        <>
          <p>
            If you received an item as a gift, you may return it for store credit equal to the purchase price of the item. To process a gift return:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Contact customer service with any gift receipt information or the purchaser's name and approximate purchase date.</li>
            <li>Once verified, you will receive store credit that can be used for future purchases.</li>
          </ol>
        </>
      )
    },
    {
      title: "10. Special Promotions and Sales",
      content: (
        <>
          <p>
            Items purchased during special promotions or sales events are subject to the same return policy unless otherwise stated at the time of purchase. 
          </p>
          <p className="mt-2">
            Limited edition, discontinued, or seasonal products may have different return eligibility. Please check the product description or contact customer service for details.
          </p>
        </>
      )
    },
    {
      title: "11. Contact Information",
      content: (
        <>
          <p>
            For any questions or concerns regarding our return policy, please contact our customer service team:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: returns@veloriaperfumes.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Customer Service Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <PolicyPage
      title="Return Policy"
      subtitle="Our guidelines for returns, exchanges, and refunds"
      sections={sections}
    />
  );
};

export default ReturnPolicy; 