import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Check, Download, Printer } from 'lucide-react';
import './Invoice.css'; // We'll create this CSS next

const Invoice = ({ order, customer, pet, onClose }) => {
    if (!order || !customer || !pet) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <motion.div
            className="invoice-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="invoice-paper" id="invoice-content">
                <div className="invoice-header">
                    <div className="shop-branding">
                        <h1>Siyam's Praniseba</h1>
                        <p>Prembagan, kosaibari, Uttrar, Dhaka-1230</p>
                        <p>Tel: 01304050607</p>
                    </div>
                    <div className="invoice-meta">
                        <h2>INVOICE</h2>
                        <p><strong>Invoice #:</strong> {order.orderNumber}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <div className="payment-status success">
                            PAID VIA {order.paymentMethod.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="invoice-body">
                    <div className="bill-to">
                        <h3>Bill To:</h3>
                        <p><strong>{customer.name}</strong></p>
                        <p>{customer.email}</p>
                        <p>{customer.phone}</p>
                        {customer.address && (
                            <p>
                                {customer.address.street}, {customer.address.city}, {customer.address.zipCode}
                            </p>
                        )}
                    </div>

                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>{pet.name}</strong>
                                    <br />
                                    <span className="item-desc">{pet.breed} - {pet.species}</span>
                                </td>
                                <td className="text-right">${pet.price}</td>
                            </tr>
                            {/* Taxes/Fees could go here */}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Subtotal</td>
                                <td className="text-right">${pet.price}</td>
                            </tr>
                            <tr className="total-row">
                                <td>Total</td>
                                <td className="text-right">${pet.price}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="invoice-footer">
                        <p>Thank you for choosing Siyam's Praniseba!</p>
                        <p className="terms">This is a system generated invoice.</p>
                    </div>
                </div>
            </div>

            <div className="invoice-actions">
                <Button variant="secondary" onClick={handlePrint} icon={<Printer size={16} />}>Print / Save PDF</Button>
                <Button variant="primary" onClick={onClose} icon={<Check size={16} />}>Close</Button>
            </div>
        </motion.div>
    );
};

export default Invoice;
