import React, { useEffect, useState } from "react";
import { UserOutlined, DownloadOutlined, FileExcelOutlined, TeamOutlined, DollarOutlined, ReadOutlined, NumberOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, ConfigProvider, Statistic, Tag, Table, Input, Select, Spin, Row, Button, Space, message, Modal, Typography, Form } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import axios from "axios";
import '../admin-pages/styles/application.css';
import API_ENDPOINTS from "../../../../../Endpoints/environment";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const schoolsData = {
    "School of Sciences": [
        "Mathematics / Geography",
        "Maths / Economics",
        "Maths / Biology",
        "Maths / Computer Science",
        "Maths / Special Education",
        "Biology / Inter Science",
        "Integrated Sciences (Double Major)",
        "Biology / Geography",
        "PHE (Double Major)",
        "Biology / Special Education",
    ],
    "School of Technical Education": [
        "Technical Education Double Major",
        "Electrical / Electronics",
        "Automobile",
        "Building",
        "Wood Work",
        "Metal Work",
    ],
    "School of Arts and Social Sciences": [
        "Geography / History",
        "Geography / Economics",
        "Geography / Social Studies",
        "History / CRS",
        "History / Islamic Studies",
        "Social Studies / Economics",
        "Social Studies / CRS",
        "Social Studies / Islamic Studies",
        "Islamic Studies / Special Education",
        "Eco / Special Education",
        "CRS / Special Education",
        "History / Special Education",
    ],
    "School of Education": [
        "Primary Education Studies (Double Major)",
        "Early Childhood Care Education (Double Major)",
    ],
    "School of Languages": [
        "English / History",
        "English / CRS",
        "English / Arabic",
        "English / Hausa",
        "English / Social Studies",
        "Hausa / Islamic Studies",
        "Hausa / Arabic",
        "Hausa / Social Studies",
        "Arabic / Islamic Studies",
        "English / Islamic Studies",
        "Arabic / Social Studies",
        "English / Special Education",
        "Hausa / Special Education",
    ],
    "School of Vocational Education": [
        "Agricultural Science Education (Double Major)",
        "Home Economics (Double Major)",
        "Business Education (Double Major)",
    ],
};
const styles = {
    container: {
        paddingLeft: '5%',
        paddingRight: '5%',
    },
    card: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px',
    },
    '@media (min-width: 768px)': {
        searchContainer: {
            flexDirection: 'row',
        }
    },
    exportSection: {
        marginBottom: '24px',
        padding: '16px',
        background: '#fafafa',
        borderRadius: '8px',
    },
    exportButton: {
        width: '100%',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 16px',
    },
    exportGroup: {
        marginBottom: '16px',
    },
    exportGroupTitle: {
        marginBottom: '8px',
        color: '#1890ff',
        fontWeight: '500',
    },
    modalContent: {
        maxHeight: '70vh',
        overflowY: 'auto',
    },
};



export const Student_Stats = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [studentsWithPartialPayment, setStudentsWithPartialPayment] = useState(0);
    const [studentsWithFullPayment, setStudentsWithFullPayment] = useState(0);
    const [studentsWithMatric, setStudentsWithMatric] = useState(0);
    const [studentsWithNotPaid, setStudentsWithNotPaid] = useState(0);
    const [approvedStudents, setApprovedStudents] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [student_details, setstudent_details] = useState(null);
    const [searchNumber, setSearchNumber] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [student_id, setStudent_id] = useState("");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [studyCent, setStudyCent] = useState("");
    const [studyCenterData, setStudyCenterData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [selectedExportCenter, setSelectedExportCenter] = useState("");
    const [studentName, setStudentName] = useState("");
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/personal-details`);
            setData(response.data);
            setAllData(response.data);
            setStudentsWithPartialPayment(response.data.filter((student) => student.has_paid == "1" && student.course_paid == "0").length);
            setStudentsWithFullPayment(response.data.filter((student) => student.course_paid == "1").length);
            setStudentsWithNotPaid(response.data.filter((student) => student.matric_number && student.has_paid == "0").length);
            setStudentsWithMatric(response.data.filter((student) => student.matric_number).length);
            setApprovedStudents(response.data.filter((student) => student.has_admission).length);
            setTotalApplications(response.data.length);

            // Process study center data    
            const centers = ['Salka', 'Mokwa', 'suleja', 'Kagara', 'New Bussa', 'Gulu', 'Gawu', 'Doko', 'Katcha', 'Rijau', 'Kontogora'];
            const centerStats = centers.map(center => {
                const newIntake = response.data.filter(student => !student.matric_number || getStudentLevel(student.matric_number) == 1);
                const centerStudents = newIntake.filter(student => student.desired_study_cent == center);
                return {
                    name: '(' + centerStudents.length + ')' + ' ' + center,
                    total: centerStudents.length,
                    approved: centerStudents.filter(student => student.has_admission).length
                };
            });
            setStudyCenterData(centerStats);
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };
    // statsBy

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchStudents(pagination.current, search, studyCent);
    }, [pagination.current, search, studyCent]);

    const fetchStudents = async (page, searchValue, studyCentValue) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/personal-details-paged`, {
                params: {
                    page,
                    search: searchValue,
                    study_cent: studyCentValue,
                    type: null,
                },
            });

            setData(response.data.data);
            setPagination({
                ...pagination,
                total: response.data.total,
            });
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setPagination({ ...pagination });
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleFilterChange = (value) => {
        setStudyCent(value);
    };

    const pieData = [
        { name: 'Partial Payment', value: studentsWithPartialPayment },
        { name: 'Full Payment', value: studentsWithFullPayment },
        { name: 'Not Paid', value: studentsWithNotPaid }
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "other_names",
            key: "other_names",
        },
        {
            title: "Application/ Matric Number",
            dataIndex: "application_number",
            key: "application_number",
        },
        {
            title: "Study Center",
            dataIndex: "desired_study_cent",
            key: "desired_study_cent",
        },
        {
            title: "Payment Status",
            key: "payment_status",
            render: (_, record) => (
                <span>
                    {record.course_paid == "1" ? (
                        <Tag color="green">Full Payment</Tag>
                    ) : record.has_paid == "1" ? (
                        <Tag color="blue">Partial Payment</Tag>
                    ) : (
                        <Tag color="red">No Payment</Tag>
                    )}
                </span>
            ),
        },
        {
            title: "Admission Status",
            dataIndex: "has_admission",
            key: "has_admission",
            render: (has_admission) => (
                <span>
                    {has_admission ? (
                        <Tag color="green">Approved</Tag>
                    ) : (
                        <Tag color="red">Not Approved</Tag>
                    )}
                </span>
            ),
        },
    ];

    const exportToCSV = (data, filename, includeAmount = false) => {
        if (!data || data.length == 0) {
            message.warning('No data to export');
            return;
        }

        // Get headers from columns
        let headers = columns.map(col => col.title);
        if (includeAmount) {
            headers.push('Amount Paid (₦)');
        }

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...data.map(row => {
                let rowData = columns.map(col => {
                    if (col.key == 'payment_status') {
                        if (row.course_paid == "1") return 'Full Payment';
                        if (row.has_paid == "1" && row.course_paid == "0") return 'Partial Payment';
                        return 'No Payment';
                    }
                    if (col.dataIndex == 'has_admission') {
                        return row[col.dataIndex] ? 'Approved' : 'Not Approved';
                    }
                    return row[col.dataIndex] || '';
                });

                if (includeAmount) {
                    const amount = row.course_paid == "1" ? "₦40,000" :
                        (row.has_paid == "1" ? "₦24,000" : "₦0");
                    rowData.push(amount);
                }

                return rowData.join(',');
            })
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStudentLevel = (matricNumber) => {
        if (!matricNumber) return null;

        // Extract the year part from matric number
        const match = matricNumber.match(/\/(\d{2})\/\d+/);
        if (!match) return null;

        const year = parseInt(match[1]);
        const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year

        // Calculate level based on year difference
        const level = currentYear - year + 1;
        return level >= 1 && level <= 4 ? level : null;
    };

    const getLevelCount = (level) => {
        return allData.filter(student => getStudentLevel(student.matric_number) == level).length;
    };

    const getFilteredData = (filterType) => {
        let filteredData = allData;

        // First filter by selected center if any
        if (selectedExportCenter) {
            filteredData = filteredData.filter(student => student.desired_study_cent == selectedExportCenter);
        }

        // Then apply the specific filter type
        switch (filterType) {
            case 'partial':
                return filteredData.filter(student => student.has_paid == "1" && student.course_paid == "0");
            case 'full':
                return filteredData.filter(student => student.course_paid == "1");
            case 'none':
                return filteredData.filter(student => student.has_paid == "0");
            case 'matric':
                return filteredData.filter(student => student.matric_number);
            case 'paid':
                return filteredData.filter(student => student.has_paid == "1" || student.course_paid == "1");
            case 'acceptance':
                return filteredData.filter(student => student.application_reference !== null);
            case 'level1':
                return filteredData.filter(student => getStudentLevel(student.matric_number) == 1);
            case 'level2':
                return filteredData.filter(student => getStudentLevel(student.matric_number) == 2);
            case 'level3':
                return filteredData.filter(student => getStudentLevel(student.matric_number) == 3);
            case 'level4':
                return filteredData.filter(student => getStudentLevel(student.matric_number) == 4);
            default:
                return filteredData;
        }
    };

    const ExportModal = () => {
        const handleCenterChange = (value) => {
            setSelectedExportCenter(value);
        };

        const renderExportGroup = (title, icon, buttons) => (
            <div className="export-group">
                <div className="export-group-title">
                    {icon}
                    <span>{title}</span>
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {buttons}
                </Space>
            </div>
        );

        return (
            <Modal
                className="export-modal"
                title={
                    <Space>
                        <FileExcelOutlined />
                        <span>Export Student Data</span>
                    </Space>
                }
                open={isExportModalVisible}
                onCancel={() => {
                    setIsExportModalVisible(false);
                    setSelectedExportCenter(""); // Reset center filter when modal closes
                }}
                footer={null}
                width={600}
                centered
            >
                <div className="export-modal-content">


                    {renderExportGroup("All Students", <TeamOutlined />, [
                        <Button
                            key="all"
                            className="export-button"
                            onClick={() => {
                                const data = getFilteredData('all');
                                exportToCSV(data, `all_students${selectedExportCenter ? `_${selectedExportCenter}` : ''}.csv`);
                                setIsExportModalVisible(false);
                                setSelectedExportCenter("");
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export All Students</span>
                            <span className="count">{getFilteredData('all').length}</span>
                        </Button>
                    ])}


                    {renderExportGroup("Level-wise Export", <ReadOutlined />, [
                        <Button
                            key="level1"
                            className="export-button"
                            onClick={() => {
                                const level1Data = getFilteredData('level1');
                                if (level1Data.length > 0) {
                                    exportToCSV(level1Data, '100_level_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No 100 level students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export 100 Level</span>
                            <span className="count">{getLevelCount(1)}</span>
                        </Button>,
                        <Button
                            key="level2"
                            className="export-button"
                            onClick={() => {
                                const level2Data = getFilteredData('level2');
                                if (level2Data.length > 0) {
                                    exportToCSV(level2Data, '200_level_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No 200 level students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export 200 Level</span>
                            <span className="count">{getLevelCount(2)}</span>
                        </Button>,
                        <Button
                            key="level3"
                            className="export-button"
                            onClick={() => {
                                const level3Data = getFilteredData('level3');
                                if (level3Data.length > 0) {
                                    exportToCSV(level3Data, '300_level_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No 300 level students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export 300 Level</span>
                            <span className="count">{getLevelCount(3)}</span>
                        </Button>,
                        <Button
                            key="level4"
                            className="export-button"
                            onClick={() => {
                                const level4Data = getFilteredData('level4');
                                if (level4Data.length > 0) {
                                    exportToCSV(level4Data, '400_level_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No 400 level students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export 400 Level</span>
                            <span className="count">{getLevelCount(4)}</span>
                        </Button>
                    ])}

                    {renderExportGroup("Payment Status", <DollarOutlined />, [
                        <Button
                            key="paid"
                            className="export-button"
                            onClick={() => {
                                const paidData = getFilteredData('paid');
                                if (paidData.length > 0) {
                                    exportToCSV(paidData, 'paid_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No paid students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export Paid Students</span>
                            <span className="count">{studentsWithPartialPayment + studentsWithFullPayment}</span>
                        </Button>,
                        <Button
                            key="partial"
                            className="export-button"
                            onClick={() => {
                                const partialData = getFilteredData('partial');
                                if (partialData.length > 0) {
                                    exportToCSV(partialData, 'partial_payment_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No partial payment students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export Partial Payment</span>
                            <span className="count">{studentsWithPartialPayment}</span>
                        </Button>,
                        <Button
                            key="full"
                            className="export-button"
                            onClick={() => {
                                const fullData = getFilteredData('full');
                                if (fullData.length > 0) {
                                    exportToCSV(fullData, 'full_payment_students.csv', true);
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No full payment students found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export Full Payment</span>
                            <span className="count">{studentsWithFullPayment}</span>
                        </Button>,
                        <Button
                            key="none"
                            className="export-button"
                            onClick={() => {
                                const noPaymentData = getFilteredData('none');
                                if (noPaymentData.length > 0) {
                                    exportToCSV(noPaymentData, 'no_payment_students.csv');
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No students without payment found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export No Payment</span>
                            <span className="count">{allData.length - studentsWithPartialPayment - studentsWithFullPayment}</span>
                        </Button>
                    ])}



                    {renderExportGroup("Other Exports", <NumberOutlined />, [
                        <Button
                            key="matric"
                            className="export-button"
                            onClick={() => {
                                const matricData = getFilteredData('matric');
                                if (matricData.length > 0) {
                                    exportToCSV(matricData, 'students_with_matric.csv');
                                    setIsExportModalVisible(false);
                                } else {
                                    message.warning('No students with matric numbers found');
                                }
                            }}
                        >
                            <DownloadOutlined />
                            <span>Export With Matric</span>
                            <span className="count">{studentsWithMatric}</span>
                        </Button>
                    ])}
                </div>
            </Modal>
        );
    };

    const handleSearchStudent = async () => {
        if (!searchNumber) {
            message.error("Please enter an application/matric number");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${API_ENDPOINTS.STUDENT_CHECK}`, {
                application_number: searchNumber,
            });
            console.log(response.data);
            if (response.data.student_detail || response.data.user.student_detail) {
                setstudent_details(response.data.student_detail || response.data.user.student_detail);
                const surname = response.data?.surname || response.data.user?.surname;
                const otherNames = response.data?.other_names || response.data.user?.other_names;
                const fullName = surname + " " + otherNames;
                setStudentName(fullName);
                setSelectedSchool(response.data?.student_detail?.first_school || response.data.user?.student_detail?.first_school);
                setSelectedCourse(response.data?.student_detail?.first_course || response.data.user?.student_detail?.first_course);
                setButtonDisabled(false);
                setStudent_id(response.data?.id || response.data.user?.id);
            } else {
                message.error("Student not found");
                setstudent_details(null);
                setButtonDisabled(true);
            }
        } catch (error) {
            console.error("Error checking student:", error);
            message.error("Error checking student details");
            setstudent_details(null);
            setButtonDisabled(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        if (!selectedSchool || !selectedCourse) {
            message.error("Please select both school and course");
            return;
        }
        try {
            const formData = {
                new_school: values.first_school,
                new_course: values.first_course
            }
            console.log(formData);
            const courseChange = await axios.put(`${API_ENDPOINTS.SCHOOL_DETAILS}/${student_id}`, formData);
            console.log(courseChange);
            if (courseChange) {
                message.success("Course updated successfully");
                // Reset all states
                setIsModalVisible(false);
                setstudent_details(null);
                setSearchNumber("");
                setSelectedSchool("");
                setSelectedCourse("");
                setButtonDisabled(true);
                setLoading(false);
                // Refresh the data
                fetchData();
            } else {
                message.error("Failed to update course");
                setButtonDisabled(false);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error updating course:", error);
            message.error("Error updating course");
            setButtonDisabled(false);
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={styles.card}>
                        <Statistic
                            title="Students with Partial Payment (60%)"
                            value={studentsWithPartialPayment}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                            Students who have paid at least 60% of their total fees.
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={styles.card}>
                        <Statistic
                            title="Students with Full Payment"
                            value={studentsWithFullPayment}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                            Students who have completed full payment of their fees for the session.
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={styles.card}>
                        <Statistic
                            title="Students Not Paid"
                            value={studentsWithNotPaid}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<UserOutlined />}
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                            Students with a matric number (admitted) but have not paid their school fees.
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={styles.card}>
                        <Statistic
                            title="Approved Students"
                            value={approvedStudents}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                            All students with approved admission — not just new intakes.
                        </Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    <Card title="Payment Status Distribution" bordered={false} style={styles.card}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Study Center Applications" bordered={false} style={styles.card}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={studyCenterData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="total"
                                    name="Total Applications"
                                    fill="#8884d8"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="approved"
                                    name="Approved Applications"
                                    fill="#82ca9d"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Card style={{ ...styles.card, marginTop: '16px' }}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#028f64',
                            borderRadius: 2,
                            margin: '20px',
                            colorBgContainer: '#f6ffed',
                        },
                    }}
                >
                    <div className="table-header-section">
                        <div className="table-header-left">
                            <Search
                                placeholder="Search by Matric/Application Number"
                                allowClear
                                onSearch={handleSearch}
                                className="search-input"
                            />

                            <Select
                                placeholder="Filter by Study Center"
                                allowClear
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <Option value="Salka">Salka</Option>
                                <Option value="Mokwa">Mokwa</Option>
                                <Option value="suleja">Suleja</Option>
                                <Option value="Kagara">Kagara</Option>
                                <Option value="New Bussa">New Bussa</Option>
                                <Option value="Gulu">Gulu</Option>
                                <Option value="Gawu">Gawu</Option>
                                <Option value="Doko">Doko</Option>
                                <Option value="Katcha">Katcha</Option>
                                <Option value="Rijau">Rijau</Option>
                                <Option value="Kontogora">Kontogora</Option>
                            </Select>
                        </div>

                        <div className="table-header-right">
                            <Button
                                type="primary"
                                className="export-trigger-button"
                                onClick={() => setIsExportModalVisible(true)}
                                style={{ marginRight: '10px' }}
                            >
                                <FileExcelOutlined />
                                <span>Export Student Data</span>
                            </Button>
                            <Button
                                type="primary"
                                className="export-trigger-button"
                                onClick={() => setIsModalVisible(true)}
                                style={{ backgroundColor: '#028f64', borderColor: '#028f64' }}
                            >
                                <UserOutlined />
                                <span>Change Course</span>
                            </Button>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey={(record) => record.id}
                            pagination={pagination}
                            onChange={handleTableChange}
                            bordered
                            scroll={{ x: true }}
                        />
                    </Spin>
                </ConfigProvider>
            </Card>
            <Modal
                title="Change New Student Course"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setstudent_details(null);
                    setSearchNumber("");
                    setSelectedSchool("");
                    setSelectedCourse("");
                    setButtonDisabled(true);
                    setLoading(false);
                }}
                footer={null}
                centered
            >
                <div className="choice-sub">
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="application-form"
                    >
                        <div style={{ marginBottom: "20px" }}>
                            <Form.Item
                                label="Application"
                                required
                            >
                                <Input
                                    placeholder="Enter application of new student"
                                    value={searchNumber}
                                    onChange={(e) => setSearchNumber(e.target.value)}
                                    disabled={loading}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                onClick={handleSearchStudent}
                                loading={loading}
                                style={{ 
                                    marginBottom: "20px",
                                    borderColor: "#028f64",
                                    color: "#028f64",
                                    backgroundColor: "transparent"
                                }}
                                icon={<SearchOutlined />}
                            >
                                Search Student
                            </Button>
                        </div>

                        {student_details && (
                            <>
                                <h3 style={{ marginBottom: "20px" }}>{studentName}</h3>
                                <div style={{ marginBottom: "20px" }}>
                                    <Form.Item
                                        label="Current School"
                                    >
                                        <Input value={student_details.first_school} disabled />
                                    </Form.Item>
                                    <Form.Item
                                        label="Current Course"
                                    >
                                        <Input value={student_details.first_course} disabled />
                                    </Form.Item>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <Form.Item
                                        label="Select New School"
                                        name="first_school"
                                        rules={[
                                            { required: true, message: "Please select a school!" },
                                        ]}
                                    >
                                        <Select
                                            placeholder="-- Select a School --"
                                            value={selectedSchool}
                                            onChange={(value) => setSelectedSchool(value)}
                                            allowClear
                                        >
                                            {Object.keys(schoolsData).map((school, index) => (
                                                <Option key={index} value={school}>
                                                    {school}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <Form.Item
                                        label="Select New Course"
                                        name="first_course"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select a course!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="-- Select a Course --"
                                            allowClear
                                            value={selectedCourse}
                                            onChange={(value) => setSelectedCourse(value)}
                                            disabled={!selectedSchool}
                                        >
                                            {selectedSchool &&
                                                schoolsData[selectedSchool].map((course, index) => (
                                                    <Option key={index} value={course}>
                                                        {course}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={buttonDisabled}
                                    style={{
                                        backgroundColor: "#028f64",
                                        borderColor: "#028f64",
                                        padding: "10px 40px",
                                        color: 'white',
                                        width: 'max-content'
                                    }}
                                >
                                    Update Course
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </Modal>
            <ExportModal />
        </div>
    );
};
