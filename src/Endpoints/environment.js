// const API_BASE_URL = 'https://coestudycenter.com.ng/coe_centre_backend/public/api';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const API_ENDPOINTS = {
    API_BASE_URL:`${API_BASE_URL}`,
    IMAGE:`${API_BASE_URL}/file/get`,
    STUDENT_CHECK:`${API_BASE_URL}/student_check`,
    UPLOAD:`${API_BASE_URL}/upload`,
    LOGIN:`${API_BASE_URL}/login`,
    BIO_REGISTRATION:`${API_BASE_URL}/bio-registrations`,
    PERSONAL_DETAILS:`${API_BASE_URL}/personal-details`,
    SCHOOL_DETAILS:`${API_BASE_URL}/student-details`,
    EDUCATIONALS_APPLICATION:`${API_BASE_URL}/educational-details`,
    APPROVE:`${API_BASE_URL}/approve`,
    APPROVE_PRENCE:`${API_BASE_URL}/approve_prence`,
    VERIFY_REFERENCE:`${API_BASE_URL}/verify_reference`,

}

export default API_ENDPOINTS;
