import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Alert, Card, Spin } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import API_ENDPOINTS from '../../../Endpoints/environment';

// IMPORTANT: This component assumes you have a proxy or service 
// that handles the actual API call to Paystack without exposing your secret key
// You can use services like Netlify Functions, Vercel API Routes, or similar

const PaystackVerification = ({ userEmail, id, applicationNumber }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(userEmail);

    const [verification, setVerification] = useState({
        status: null, // 'success', 'error', or null
        message: '',
    });
    const navigate = useNavigate();


    // This is a proxy function that would call your secure backend service
    // Keeping the secret key secure is critical and should never be in frontend code
    const verifyWithPaystack = async (reference) => {
        // Replace this URL with your service/proxy endpoint
        // This could be a serverless function URL
        const verificationUrl = `${process.env.REACT_APP_VERIFICATION_SERVICE_URL}`;

        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer sk_live_e3b9e696b9659fd262cfa02496ac33e3df09dd6f`,
                        'Content-Type': 'application/json',
                    }
                });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Verification service unavailable');
        }
    };

    const verifyPayment = async (values) => {
        setLoading(true);
        setVerification({ status: null, message: '' });
        try {
            // Try to check if reference exists
            let referenceExists = false;
            try {
                const referenceCheck = await axios.get(`${API_ENDPOINTS.VERIFY_REFERENCE}/${values.reference}`);
                referenceExists = true;

                // Handle case when reference exists
                if (referenceCheck.data.application_number !== applicationNumber) {
                    setVerification({
                        status: 'error',
                        message: 'This reference has already been used by another user'
                    });
                    setLoading(false);
                    return;
                } else {
                    if (referenceCheck.data.matric_number) {
                        setVerification({
                            status: 'error',
                            message: 'This reference has already been used by Yourself'
                        });
                    } else {
                        setVerification({
                            status: 'error',
                            message: 'This reference has already been used by Yourself for registration fee'
                        });
                    }
                    setLoading(false);
                    return;
                }
            } catch (referenceError) {
                // If we get here, the reference wasn't found (404)
                // We want to continue to Paystack verification
                if (referenceError.response && referenceError.response.status === 404) {
                    // Reference not found, which is good - proceed to Paystack verification
                    referenceExists = false;
                } else {
                    // Some other error occurred
                    throw referenceError;
                }
            }

            // Only proceed to Paystack if reference wasn't found in our system
            if (!referenceExists) {
                try {
                    // Call the proxy service that will make the secure Paystack API call
                    const paystackResponse = await verifyWithPaystack(values.reference);

                    if (paystackResponse.status === true) {
                        // Rest of your Paystack verification logic
                        const paystackAmount = paystackResponse.data.amount / 100;
                        const formAmount = Number(values.amount);
                        const paystackEmail = paystackResponse.data.customer.email;

                        if (paystackAmount === formAmount && paystackEmail === userEmail) {
                            // Successful verification logic
                            const paidOn = new Date();

                            const formData = {
                                application_reference: values.reference,
                                email: email,
                                application_date: paidOn.toISOString().split('T')[0],

                            };
                            try {
                                // Send the form data to the API
                                const response = await axios.put(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`, formData);

                                console.log('Server response:', response);
                                if (response && response.data.id) {

                                    // Store the ID from the response
                                    localStorage.setItem("id", response.data.id);

                                    // Navigate to the dashboard
                                    navigate(`/dashboard/${response.data.id}/acceptance-receipt`);
                                } else {
                                    console.error("No ID returned in the response.");
                                    alert("Payment successful, but we couldn't process your data. Please contact support.");
                                }
                            } catch (error) {
                                console.error("Error sending user data:", error);
                                alert("An error occurred while processing your payment. Please try again.");
                            }
                            // ...rest of your code
                        } else if (paystackAmount !== formAmount) {
                            setVerification({
                                status: 'error',
                                message: 'No acceptance fee with that reference exists. The amount provided does not match our records.'
                            });
                        } else {
                            setVerification({
                                status: 'error',
                                message: 'The payment reference is not associated with your account.'
                            });
                        }
                    } else {
                        setVerification({
                            status: 'error',
                            message: 'Invalid payment reference. Please check and try again.'
                        });
                    }
                } catch (paystackError) {
                    setVerification({
                        status: 'error',
                        message: paystackError.message || 'Failed to verify payment with Paystack. Please try again later.'
                    });
                }
            }
        } catch (error) {
            setVerification({
                status: 'error',
                message: error.message || 'Failed to verify payment. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title="Verify Your Payment"
            className="max-w-md mx-auto shadow-md rounded-lg"
            headStyle={{
                background: '#f0f5ff',
                borderBottom: '1px solid #d9e6ff',
                fontSize: '18px',
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={verifyPayment}
                autoComplete="off"
            >
                <Form.Item
                    name="reference"
                    label="Transaction Reference"
                    rules={[
                        { required: true, message: 'Please enter the transaction reference' },
                        { min: 8, message: 'Reference should be at least 8 characters' }
                    ]}
                >
                    <Input placeholder="Enter transaction reference" className="rounded-md" />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount Paid (₦)"
                    rules={[
                        { required: true, message: 'Please enter the amount paid' },
                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount' }
                    ]}
                >
                    <Input placeholder="Enter amount (e.g. 5000)" className="rounded-md" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Verify Payment
                    </Button>
                </Form.Item>
            </Form>

            {verification.status && (
                <Alert
                    message={verification.status === 'success' ? "Payment Verified" : "Verification Failed"}
                    description={verification.message}
                    type={verification.status}
                    showIcon
                    icon={verification.status === 'success' ? <CheckCircleOutlined /> : <WarningOutlined />}
                    className="mt-4"
                />
            )}

            {loading && (
                <div className="text-center mt-4">
                    <Spin tip="Verifying payment..." />
                </div>
            )}
        </Card>
    );
};

export default PaystackVerification;