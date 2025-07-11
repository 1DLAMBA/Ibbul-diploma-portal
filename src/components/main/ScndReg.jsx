import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, Typography, Row, Col } from 'antd';

const schoolsData = {
    "School of Sciences": [
        "Mathematics / Geography",
        "Maths / Economics",
        "Maths / Biology",
        "Maths / Special Education",
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

const ScndReg = () => {
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    

    const handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
        setSelectedCourse(""); // Reset the course dropdown when school changes
    };
   
    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>School and Course Selection</h2>
            <form>
                {/* School Dropdown */}

                <h4>School Attended</h4>
                <h5>Primary</h5>
                <Row gutter={[16, 16]}>

                    <b>1</b>
                    <Col xs={12} md={8}>
                        <Form.Item
                            label="School Name"
                            name="school_name_1"
                            rules={[{ required: true, message: "Please enter School Name" }]}
                        >
                            <Input placeholder="Enter School name" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="From"
                            name="school_from_1"
                            rules={[{ required: true, message: "Please enter your arrival date in the school" }]}
                        >
                            <DatePicker style={{ width: '100%' }} />

                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="To"
                            name="school_to_1"
                            rules={[{ required: true, message: "Please enter when you exited the school" }]}
                        >
                            <DatePicker style={{ width: '100%' }} />

                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>

                    <b>2</b>
                    <Col xs={12} md={8}>
                        <Form.Item
                            label="School Name"
                            name="school_name_2"

                        >
                            <Input placeholder="Enter School name" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="From"
                            name="school_from_2"
                        >
                            <DatePicker style={{ width: '100%' }} />

                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="To"
                            name="school_to_2"
                        >
                            <DatePicker style={{ width: '100%' }} />

                        </Form.Item>
                    </Col>
                </Row>


                <h5>Secondary</h5>
                <Row gutter={[16, 16]}>

                    <b>1</b>
                    <Col xs={12} md={8}>
                        <Form.Item
                            label="School Name"
                            name="school_name_1"
                            rules={[{ required: true, message: "Please enter School Name" }]}
                        >
                            <Input placeholder="Enter School name" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="From"
                            name="school_from_1"
                            rules={[{ required: true, message: "Please enter your Father's State of Origin" }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="To"
                            name="school_to_1"
                            rules={[{ required: true, message: "Please enter your Father's Place of Birth" }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>

                    <b>2</b>
                    <Col xs={12} md={8}>
                        <Form.Item
                            label="School Name"
                            name="school_name_2"

                        >
                            <Input placeholder="Enter School name" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="From"
                            name="school_from_2"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="To"
                            name="school_to_2"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="choice">
                    <div>

                        <h5>First Choice</h5>
                        <div className="choice-sub">

                            <div style={{ marginBottom: "20px", marginRight: '1%' }}>
                                <label htmlFor="school">Select School:</label><br></br>
                                <select
                                    id="school"
                                    value={selectedSchool}
                                    onChange={handleSchoolChange}
                                    style={{ marginLeft: "10px" }}
                                >
                                    <option value="">-- Select a School --</option>
                                    {Object.keys(schoolsData).map((school, index) => (
                                        <option key={index} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Dropdown */}
                            <div style={{ marginBottom: "20px" }}>
                                <label htmlFor="course">Select Course:</label><br></br>
                                <select
                                    id="course"
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    style={{ marginLeft: "10px" }}
                                    disabled={!selectedSchool} // Disable if no school is selected
                                >
                                    <option value="">-- Select a Course --</option>
                                    {selectedSchool &&
                                        schoolsData[selectedSchool].map((course, index) => (
                                            <option key={index} value={course}>
                                                {course}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>

                        <h5>Second Choice</h5>
                        <div className="choice-sub">

                            <div style={{ marginBottom: "20px", marginRight: '1%' }}>
                                <label htmlFor="school">Select School:</label><br></br>
                                <select
                                    id="school"
                                    value={selectedSchool}
                                    onChange={handleSchoolChange}
                                    style={{ marginLeft: "10px" }}
                                >
                                    <option value="">-- Select a School --</option>
                                    {Object.keys(schoolsData).map((school, index) => (
                                        <option key={index} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Dropdown */}
                            <div style={{ marginBottom: "20px" }}>
                                <label htmlFor="course">Select Course:</label><br></br>
                                <select
                                    id="course"
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    style={{ marginLeft: "10px" }}
                                    disabled={!selectedSchool} // Disable if no school is selected
                                >
                                    <option value="">-- Select a Course --</option>
                                    {selectedSchool &&
                                        schoolsData[selectedSchool].map((course, index) => (
                                            <option key={index} value={course}>
                                                {course}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

               

                {/* Display Selected Values */}
                {/* <div>
                    <p>
                        <strong>Selected School:</strong> {selectedSchool || "None"}
                    </p>
                    <p>
                        <strong>Selected Course:</strong> {selectedCourse || "None"}
                    </p>
                </div> */}
            </form>
        </div>
    );
};

export default ScndReg;
