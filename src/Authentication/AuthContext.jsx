import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../Endpoints/environment';

export const AuthContext = createContext();

export const AuthProvider =({children})=>{
    const [user, setUser] = useState(() => {
        const storedData = localStorage.getItem('user');
        return storedData ? JSON.parse(storedData) : null;
    })
    
    useEffect(() => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);

      const applicationCheck = async (application_number) => {
        try {
            const response = await axios.post(API_ENDPOINTS.STUDENT_CHECK, {
                application_number: application_number,
            });
            console.log(response)
            setUser(response.data.utme_result); // Save the user data from the response
            localStorage.setItem('user',  response.data.utme_result);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Optionally rethrow the error for handling in the component
        }
    };
      const Login = async (matric_number, phone_number) => {
        try {
            const response = await axios.post(API_ENDPOINTS.LOGIN, {
                matric_number: matric_number,
                phone_number: phone_number,
            });
            console.log(response)
            setUser(response.data.utme_result); // Save the user data from the response
            localStorage.setItem('user',  response.data.utme_result);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Optionally rethrow the error for handling in the component
        }
    };
     return (
        <AuthContext.Provider value={{ user, applicationCheck, Login}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};