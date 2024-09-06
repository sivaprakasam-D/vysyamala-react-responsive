import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useParams } from 'react-router-dom';

// Define the correct interface for your API response
interface EducationProfession {
    education_level: string;
    education_detail: string;
    about_education: string;
    profession: string;
    company_name: string;
    business_name: string;
    business_address: string;
    annual_income: string;
    gross_annual_income: string;
    place_of_stay: string;
}

interface ApiResponse {
    education_details: EducationProfession;
    // Include other fields if needed
}

export const EducationProfessionView: React.FC = () => {
    const [profileData, setProfileData] = useState<EducationProfession | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const { user_profile_id } = useParams<{ user_profile_id: string }>();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const loginuser_profileId = sessionStorage.getItem("loginuser_profile_id");

    useEffect(() => {
        const fetchEducationProfessions = async () => {
          try {
            const response = await axios.post<ApiResponse>(
              "http://103.214.132.20:8000/auth/Get_profile_det_match/",
              {
                profile_id: loginuser_profileId,
                user_profile_id: id
              }
            );
      
            console.log("API Response:", response.data);
      
            // Extract education_details from the response
            const data = response.data.education_details;
            
            setProfileData(data);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error("Axios error:", error.response?.data || error.message);
              setError(`Axios error: ${error.response?.data || error.message}`);
            } else {
              console.error("Unexpected error:", error);
              setError("Unexpected error occurred");
            }
          } finally {
            setLoading(false);
          }
        };
      
        fetchEducationProfessions();
      }, [id]);
      
    if (loading) return <p>Loading...</p>;
    if (error) return <p>No Data Available</p>;

    if (!profileData) return <p>No data available</p>;

    return (
        <div>
            <h2 className="flex items-center text-[30px] text-vysyamalaBlack font-bold mb-5">
                Education & Profession Details
                {/* <MdModeEdit className="text-2xl text-main ml-2 cursor-pointer" /> */}
            </h2>

            <div className="grid grid-rows-1 grid-cols-2 mb-6">
                <div>
                    <h5 className="text-[20px] text-ash font-semibold mb-2">Education Level :
                        <span className="font-normal"> {profileData.education_level}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Education Details :
                        <span className="font-normal"> {profileData.education_detail}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">About Education :
                        <span className="font-normal"> {profileData.about_education || '-'}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Profession :
                        <span className="font-normal"> {profileData.profession}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Company Name :
                        <span className="font-normal"> {profileData.company_name}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Business Name :
                        <span className="font-normal"> {profileData.business_name}</span></h5>
                </div>

                <div>
                    <h5 className="text-[20px] text-ash font-semibold mb-2">Business Address :
                        <span className="font-normal"> {profileData.business_address}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Annual Income :
                        <span className="font-normal"> {profileData.annual_income}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Gross Annual Income :
                        <span className="font-normal"> {profileData.gross_annual_income || '-'}</span></h5>

                    <h5 className="text-[20px] text-ash font-semibold mb-2">Place of Stay :
                        <span className="font-normal"> {profileData.place_of_stay || '-'}</span></h5>
                </div>
            </div>
        </div>
    );
};
