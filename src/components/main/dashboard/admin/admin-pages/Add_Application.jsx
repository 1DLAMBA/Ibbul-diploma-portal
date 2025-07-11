import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import API_ENDPOINTS from '../../../../../Endpoints/environment';
// Optional CSS file for additional styling

const AddApplications = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_ENDPOINTS}/applications`, values);
            message.success('Application submitted successfully!');
            console.log(response.data);
        } catch (error) {
            message.error(error.response.data.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-applications-container">
            <h1 style={{ textAlign: 'center', color: '#028f64' }}>Add Application</h1>
            <Form
                name="add_applications"
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Form.Item
                    label="Application Number"
                    name="application_number"
                    rules={[
                        { required: true, message: 'Please enter the application number!' },
                        { len: 10, message: 'Application number must be exactly 10 characters!' }, // Ensure exactly 10 characters
                    ]}
                >
                    <Input
                        placeholder="Enter application number"
                        maxLength={10} // Restricts the input to 10 characters
                    />
                </Form.Item>

                <Form.Item
                    label="Programme"
                    name="programme"
                    rules={[{ required: true, message: 'Please enter the programme!' }]}
                >
                    <Input placeholder="Enter programme" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#028f64', borderColor: '#028f64' }}>
                        Submit Application
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddApplications;
