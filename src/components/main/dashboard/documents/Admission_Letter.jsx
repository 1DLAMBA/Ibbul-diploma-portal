import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Typography, Row, Divider, Col, ConfigProvider, Breadcrumb } from "antd";
import { PrinterOutlined, HomeFilled, PrinterFilled } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API_ENDPOINTS from "../../../../Endpoints/environment";
import axios from "axios";
import './docstyle.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../../../../assets/logo.png';
import signature from '../../../../assets/signature.jpg';





const { Title, Paragraph, Text } = Typography;

const Admission_Letter = () => {
    const letterRef = useRef(null);
    const [application, setApplication] = useState('');
    const [loader, setLoader] = useState(true);
    const { id } = useParams();
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
        // console.log('check')
        const fetchUser = async () => {
            // console.log('check')
            try {
                const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
                setApplication(response.data); // Assuming the API returns user data in `response.data`


                if (!response.data.matric_number) {
                    navigate('/');

                }


                console.log('Data', response.data.data);
                setLoader(false);

            } catch (error) {
                console.error("Error fetching user data:", error);
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
            pdf.save("admission_letter.pdf");
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
                    className="admission-letter"
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
                    align="middle" justify="space-around"
                >
                    <div style={{ textAlign: "left", marginBottom: 10 }}>
                        <Row gutter={[8, 4]} align="middle">
                            <Col span={4}>
                                <img src={logo} alt="University Logo" style={{ width: '60px' }} />
                            </Col>
                            <Col span={16} style={{ textAlign: 'center' }}>
                                <Title level={4} style={{ margin: '0 0 2px 0', fontSize: '14px' }}>IBBUL DIPLOMA PROGRAMME</Title>
                                <Text style={{ fontSize: '10px' }}>Minna, Niger State</Text>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right', fontSize: '11px' }}>
                                <Text strong>Matric: {application.matric_number || 'N/A'}</Text><br />
                                <Text>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col span={24}>
                                <Text strong>{application.surname ? application.surname.toUpperCase() : ''}, {application.other_names ? application.other_names : ''}</Text><br />
                                <Text>Minna Study Centre</Text>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col span={24}>
                                <Text>Dear Sir/ Madam</Text>
                                <Title level={4} style={{ textAlign: "center", color: "#333", margin: '10px 0', fontSize: '13px' }}>
                                    OFFER OF PROVISIONAL ADMISSION INTO DIPLOMA PROGRAMME (2025/2026 ACADEMIC SESSION)
                                </Title>
                                <Paragraph style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                    Reference to your Application for Admission into this University, after due screening of the information provided, I am pleased to inform you that you have been Offered Provisional Admission to Pursue an Academic Programme leading to the award of <b>{application.course || 'Computer Science'}</b>.
                                </Paragraph>

                                <Paragraph style={{ marginTop: '20px' }}>
                                    You are required to present the followings for Registration:
                                </Paragraph>
                                <ul style={{ lineHeight: '1.5', margin: '10px 0', paddingLeft: '20px' }}>
                                    <li>Original Copies of; this Admission Letter</li>
                                    <li>Certificates of your Claimed Educational Qualifications</li>
                                    <li>Birth Certificate/Statutory Declaration of Age</li>
                                    <li>Medical Certificate from Any Government Hospital</li>
                                    <li>Two Passports</li>
                                    <li>One rim of A4 Paper</li>
                                </ul>

                                <Paragraph style={{ marginTop: '20px' }}>
                                    Please take very Serious Note of the following Conditions which are related to your Admission and Registration:
                                </Paragraph>
                                <ol style={{ lineHeight: '1.4', margin: '10px 0', paddingLeft: '20px' }}>
                                    <li>
                                        The offer of this Admission is strictly Provisional and may be Revoked if:
                                        <ol type="a">
                                            <li>You fail to formally Accept this offer by paying the Acceptance Fee of 3,000.00 and ID Card 2,000.00 Naira) and other charges.</li>
                                            <li>You are unable to satisfy the Necessary Requirements for Admission and Registration.</li>
                                            <li>You cannot produce at the time of Registration, the Original Copies of your Certificates and other Credentials.</li>
                                        </ol>
                                    </li>
                                    <li>The Programme is on part-Time basis. Lectures are officially scheduled for Fridays and Saturdays only.</li>
                                    <li>The duration of your course is Four Semesters.</li>
                                    <li>The Attached information on Fees Payable is for your Further and Prompt Action.</li>
                                    <li>If you accept this offer kindly pay the Acceptance Fee within one week of this offer.</li>
                                    <li>Please note that all payments must be made to the University Specified Account (UBA Bank, a/c No: 1022459672) and that your name and Amount should be Boldly written on the spaces provided for Depositor and Amount Paid on the Teller.</li>
                                    <li>Payment of all Fees must be made from the date of resumption and not later than the normal Two Weeks scheduled for the Registration.</li>
                                    <li>Late Registration Attracts Penalties!</li>
                                    <li>Only those that paid their Correct Fees are allowed to register and only the fully registered Students are allowed into lecture rooms and the use of the University Facilities.</li>
                                    <li>Fees can be reviewed without prior notice to Students!</li>
                                </ol>

                                <Paragraph style={{ marginTop: '20px' }}>
                                    If you accept this offer of Admission, then kindly complete the Acceptance Letter with attached evidence of payment of the Acceptance Fees and submit to the Deputy Director.
                                </Paragraph>

                                <Paragraph style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
                                    Please Accept our Congratulations!
                                </Paragraph>

                                <div style={{ marginTop: '40px', textAlign: 'right' }}>
                                    <img 
                                        src={signature} 
                                        alt="Signature" 
                                        style={{ 
                                            height: '40px', 
                                            marginBottom: '5px',
                                            objectFit: 'contain'
                                        }} 
                                    />
                                    <div style={{ borderTop: '1px solid #000', width: '200px', marginLeft: 'auto', marginBottom: '10px' }}></div>
                                    <Text strong>Dr. Hamzat Aliyu</Text><br />
                                    <Text>Deputy Director</Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </>

    );
};

export default Admission_Letter;
