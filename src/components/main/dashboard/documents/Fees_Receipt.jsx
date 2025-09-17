import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Spin, Typography, Row, Divider, Col, ConfigProvider, Breadcrumb } from "antd";
import { PrinterOutlined, HomeFilled, PrinterFilled } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API_ENDPOINTS from "../../../../Endpoints/environment";
import axios from "axios";
import './docstyle.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../../../../assets/logo.png';





const { Title, Paragraph, Text } = Typography;

const Fees_Receipt = () => {
    const letterRef = useRef(null);
    const [application, setApplication] = useState('');
    const [loader, setLoader] = useState(true);
    const { id } = useParams();
    const [spinning, setSpinning] = useState(false);

    const navigate = useNavigate();


    const items = [
        {
            path: `/Dashboard/${id}`,
            title: <HomeFilled />,
        },

        {
            path: '/admission-letter',
            title: 'Admission Letter',

        },

    ];

    useEffect(() => {
        setSpinning(true)

        // console.log('check')
        const fetchUser = async () => {
            // console.log('check')
            try {
                const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
                setApplication(response.data); // Assuming the API returns user data in `response.data`

                setSpinning(false)
                if (!response.data.matric_number) {
                    navigate('/');

                }


                console.log('Data', response.data.data);
                setLoader(false);

            } catch (error) {
                console.error("Error fetching user data:", error);
                setSpinning(false)

            }
        };

        fetchUser(); // Call the async function to fetch data

    }, []); // Only re-run if `userId` changes



    const handlePrint = () => {
        const input = letterRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("School_Fees_Receipt.pdf");
        });
    };

    function itemRender(currentRoute, params, items, paths) {
        const isLast = currentRoute?.path === items[items.length - 1]?.path;

        return isLast ? (
            <span>{currentRoute.title}</span>
        ) : (
            <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
        );
    }

    return (
        <>

            <Breadcrumb style={{ margin: ' 1% auto', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />
            <div className="" style={{ padding: 20, textAlign: "center", backgroundColor: 'white', backgroundSize: "contain" }}>
                <Spin spinning={spinning} fullscreen />

                <ConfigProvider
                    theme={{
                        token: {
                            // Seed Token
                            colorPrimary: '#028f64',
                            borderRadius: 2,

                            // Alias Token
                            margin: '20px',
                            colorBgContainer: '#f6ffed',
                        },
                    }}
                >
                    <Button type="primary" icon={<PrinterFilled />} ghost onClick={handlePrint} >
                        Print Letter
                    </Button>
                </ConfigProvider>
                <Card
                    ref={letterRef}
                    className="fees-receipt"
                    style={{
                        width: "210mm",
                        minHeight: "auto",
                        padding: "20px 30px",
                        textAlign: "left",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #ddd",
                        margin: "10px auto",
                        fontFamily: "Arial, sans-serif",
                        lineHeight: '1.3',
                        fontSize: '12px',
                        position: 'relative'
                    }}
                >
                    <div style={{ textAlign: "left", marginBottom: 10 }}>
                        <Row gutter={[8, 4]} align="middle">
                            <Col span={4}>
                                <img src={logo} alt="University Logo" style={{ width: '60px' }} />
                            </Col>
                            <Col span={16} style={{ textAlign: 'center' }}>
                                <Title level={4} style={{ margin: '0 0 2px 0', fontSize: '16px' }}>IBBUL DIPLOMA PROGRAMME</Title>
                                <Text style={{ fontSize: '10px' }}>Minna, Niger State</Text>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right', fontSize: '11px' }}>
                                <Text strong>Receipt #: {application.matric_number || 'N/A'}</Text><br />
                                <Text>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Title level={3} style={{ margin: '0 0 5px 0', fontSize: '16px' }}>SCHOOL FEES PAYMENT RECEIPT</Title>
                        <Divider style={{ margin: '10px 0' }} />
                        
                        <Row gutter={[16, 8]} style={{ marginBottom: 15, textAlign: 'left' }}>
                            <Col span={8}>
                                <Text strong>Student Name:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>{[application.surname, application.other_names].filter(Boolean).join(' ')}</Text>
                            </Col>
                            
                            <Col span={8}>
                                <Text strong>Matric Number:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>{application.matric_number || 'N/A'}</Text>
                            </Col>
                            
                            <Col span={8}>
                                <Text strong>Department:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>{application.course || 'N/A'}</Text>
                            </Col>
                            
                            <Col span={8}>
                                <Text strong>Academic Session:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>2024/2025</Text>
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0', border: '1px solid #000' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #000' }}>
                                <th style={{ padding: '5px', borderRight: '1px solid #000', textAlign: 'left', fontSize: '11px' }}>DESCRIPTION</th>
                                <th style={{ padding: '5px', borderRight: '1px solid #000', textAlign: 'right', fontSize: '11px' }}>AMOUNT (₦)</th>
                                <th style={{ padding: '5px', borderRight: '1px solid #000', textAlign: 'center', fontSize: '11px' }}>DATE</th>
                                <th style={{ padding: '5px', textAlign: 'center', fontSize: '11px' }}>REFERENCE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '5px', border: '1px solid #000', fontSize: '11px' }}>School Fee</td>
                                <td style={{ padding: '5px', border: '1px solid #000', textAlign: 'right', fontSize: '11px' }}>
                                    {application.has_paid == 1 && application.course_paid == 1 ? '40,000.00' : 
                                     (application.has_paid == 1 && application.course_paid == 0) ? application.amount?.toLocaleString() || '0.00' : '0.00'}
                                </td>
                                <td style={{ padding: '5px', border: '1px solid #000', textAlign: 'center', fontSize: '11px' }}>
                                    {new Date(application.payment_date || new Date()).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '5px', border: '1px solid #000', textAlign: 'center', fontSize: '11px' }}>
                                    {application.payment_reference || 'N/A'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Divider />
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <div style={{ display: 'inline-block', textAlign: 'center' }}>
                            <img src={require('../../../../assets/signature.jpg')} alt="Authorized Signature" style={{ height: '50px', marginBottom: '5px' }} />
                            <div style={{ height: '1px', width: '200px', borderTop: '1px solid #000', margin: '0 auto 5px' }}></div>
                            <Text strong>Authorized Signature</Text>
                        </div>
                    </div>
                    <Divider />
                    <Paragraph>
                        <Text strong>Payment Method:</Text> Online Payment
                    </Paragraph>
                    <Divider />
                    <Paragraph>
                        This receipt serves as confirmation of your School fee payment. Please keep it for your records.
                    </Paragraph>
                    <Divider />
                    <Paragraph style={{ textAlign: "center" }}>
                        <Text strong>OFFICIAL RECEIPT</Text><br />
                        <Text>Niger State IBBU Diploma Program</Text>
                    </Paragraph>
                    <Paragraph style={{ textAlign: "right" }}>
                        <Text strong>Bursary Department</Text><br />
                        <Text>Date: {new Date().toLocaleDateString()}</Text>
                    </Paragraph>
                </Card>
            </div>
        </>
    );
};

export default Fees_Receipt;
