/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { hideInterest } from "../../../redux/slices/interestSlice";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { MdMessage, MdVerifiedUser } from "react-icons/md";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";

import { BiSolidUserVoice } from "react-icons/bi";
import { IoShareSocialSharp } from "react-icons/io5";
import { MdOutlineGrid3X3 } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import { FaTableList } from "react-icons/fa6";
// import { ProfileSlick } from "./ProfileSlick";
import { ProfileSlickView } from "../../LoginHome/ProfileDetailsView/ProfileSlickView";
import { MdLocalPrintshop } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import { TbPhotoHeart } from "react-icons/tb";
// import { ProfileDetailsSettings } from "./ProfileDetailsSettings"
// import { ProfileDetailsSettingsView } from "../../LoginHome/ProfileDetailsView/ProfileDetailsSettingsView";
// import { FeaturedProfiles } from "../../LoginHome/FeaturedProfiles";
// import { VysyaBazaar } from "../../LoginHome/VysyaBazaar";
// import { SuggestedProfiles } from "../../LoginHome/SuggestedProfiles";
import MatchingScore from "./MatchingScore";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import CustomMessagePopUp from "./CustomMessagePopup";
import {
  NotifySuccess,
  NotifyError,
} from "../../Toast/ToastNotification";
import { toast } from "react-toastify";
import { PersonalNotesPopup } from "../PersonalNotes/PersonalNotesPopup";

import { Share } from "./Share";
// import { Get_profile_det_match } from "../../../commonapicall";
import { VysAssistPopup } from "../VysAssist/VysAssistPopup";



// import { boolean } from "zod";

// Define the interfaces for profile data
interface HoroscopeDetails {
  star_name: string;
  surya_gothram: string;
}

interface EducationDetails {
  profession: string;
  education_level: string;
}

interface BasicDetails {
  profile_id: string;
  profile_name: string;
  express_int: string;
  about: string;
  user_profile_views: string;
  matching_score: number;
  horoscope_available: number;
  horoscope_link: string;
  horoscope_available_text: string;
  user_status: string;
  last_visit: string;
  verified: number;
}

interface PersonalDetails {
  age: number;
  height: string;
  weight: string;
}

interface ProfileData {
  horoscope_details: HoroscopeDetails;
  education_details: EducationDetails;
  basic_details: BasicDetails;
  personal_details: PersonalDetails;
}

interface ApiResponse {
  data: any;
  status: string;
  interest_status: string;
  // Add other fields based on the API response
}


interface ProfileDetailsExpressInterestProps { }

export const ProfileDetailsExpressInterest: React.FC<
  ProfileDetailsExpressInterestProps
> = () => {


  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isRedirect, setIsRedirect] = useState(false);



  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [PhotoPasswordlock, setPhotoPasswordlock] = useState<number>(0);
  console.log(typeof PhotoPasswordlock, "PhotoPasswordlock")
  // console.log(profileData?.basic_details.verified, "llllllllllllllllll");
  const [hideExpresButton, setHideExpressButton] = useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const interestParam = queryParams.get("interest");
  const idparam = queryParams.get("id") || "";

  const loginuser_profileId = sessionStorage.getItem("loginuser_profile_id");


  const custom_message = sessionStorage.getItem("custom_message");

  const storedPlanId = sessionStorage.getItem("plan_id");
  console.log("vysya", storedPlanId);



  const navigate = useNavigate();




  const handleMessageClick = async () => {
    try {
      const response = await axios.post('http://103.214.132.20:8000/auth/Create_or_retrievechat/', {
        // Add required parameters to create a new chat room
        profile_id: loginuser_profileId,
        profile_to: idparam,
      });

      if (response.data.Status === 1) {
        const roomId = response.data.room_id;
        const userName = response.data.username;
        setRoomId(roomId);
        setUserName(userName);
        setIsRedirect(true);
      } else {
        console.error('Failed to create chat room:', response.data.Message);
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  useEffect(() => {
    if (isRedirect) {
      window.location.href = `/messages/${roomId}/${userName}`;
    }
  }, [isRedirect, roomId, userName]);



  const handleUpdateInterest = async (profileId: string, status: string) => {
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Update_profile_intrests/",
        {
          profile_id: loginuser_profileId,
          profile_from: profileId,
          status: status,
        }
      );
      if (response.data.Status === 1) {
        // Remove the profile from the state if rejected
        if (status === "2") {
          // NotifySuccess("Interest Accepted");
          toast.success("Interest Accepted");
          setHideExpressButton(false);
          if (loginuser_profileId) {
            await fetchProfileStatusNew(loginuser_profileId);
          } else {
            console.error("loginuser_profileId is null or undefined");
          }
        } else if (status === "3") {
          // NotifyError("Interest Declined");
          toast.error("Interest Declined");
          setHideExpressButton(false);
        } else {
          console.error(
            "Error updating profile interest:",
            response.data.message
          );
          NotifyError("Error updating profile interest");
        }
      }
    } catch (error) {
      console.error("Error updating profile interest:", error);
      NotifyError("Error updating profile interest");
    }
  };



  const fetchProfileStatusNew = async (loginuser_profileId: string) => {
    try {
      const response = await axios.post<ApiResponse>(
        `http://103.214.132.20:8000/auth/Get_expresint_status/`,
        {
          profile_id: loginuser_profileId,
          profile_to: idparam,
        }
      );
      console.log("Profile interest status:", response.data.data.interest_status);
      setStatus(response.data.data.interest_status); // Adjust based on your response structure
    } catch (err) {
      console.error("Failed to fetch profile status:", err);
      // setError('Failed to fetch profile status');
    }
  };

  const [status, setStatus] = useState<number | null>(); // State to hold API status
  // const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    // Define the API call function
    const fetchProfileStatus = async (loginuser_profileId: string) => {
      try {
        const response = await axios.post<ApiResponse>(
          `http://103.214.132.20:8000/auth/Get_expresint_status/`,
          {
            profile_id: loginuser_profileId,
            profile_to: idparam
          }
        );
        console.log("dddddddddddddddddddd", response.data.data.interest_status);

        setStatus(response.data.data.interest_status); // Adjust based on your response structure
      } catch (err) {
        // setError('Failed to fetch profile status');
        console.error(err);
      }
    };

    // Fetch profile status when profileIdViewed changes
    if (loginuser_profileId) {
      fetchProfileStatus(loginuser_profileId);
    }
  }, [idparam, loginuser_profileId]); // Dependency array: effect runs when profileIdViewed changes

  console.log("valueeee", status);
  // const GetPhotoByPassword = async (Password: string) => {
  //   try {
  //     const response = await axios.post(Get_photo_bypassword, {
  //       profile_id: loginuser_profileId,
  //       profile_to: id,
  //       photo_password: Password,
  //     });

  //     if (response.status === 200) {
  //       const userImages = response.data.data.user_images;
  //       setResponse(true);
  //       // NotifySuccess("Image Unlocked Successfully");
  //       // Set the user images to the state
  //       // setProtectedImg(userImages);

  //       sessionStorage.setItem(`userImages_${id}`, JSON.stringify(userImages));
  //       // sessionStorage.setItem("userImages", JSON.stringify(userImages));
  //     }
  //   } catch (error) {
  //     NotifyError("Please Enter Correct Password");
  //   }
  // };
  console.log(idparam, "id");
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
          "http://103.214.132.20:8000/auth/Get_profile_det_match/",
          {
            profile_id: loginuser_profileId, // Replace with the appropriate value or extract from route params if needed
            user_profile_id: idparam,
          }
        );
        setProfileData(response.data);
        // setPhotoLock(response.data.photo_protection);
        sessionStorage.setItem("photolock", JSON.stringify(response.data.photo_protection));
        console.log(response.data.photo_protection);
        const storedPhotoProtectionVal = sessionStorage.getItem("photolock");
        const parsedPhotoProtectionVal = storedPhotoProtectionVal ? JSON.parse(storedPhotoProtectionVal) : "0";
        setPhotoPasswordlock(parsedPhotoProtectionVal);


        if (response.data.basic_details.express_int === "1") {
          setIsHeartMarked(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // useEffect(() => {
  //   const storedPhotoProtectionval = JSON.parse(sessionStorage.getItem("photolock") || "0");
  //   setPhotoPasswordlock(storedPhotoProtectionval);
  //   console.log("ffr");
  // }, []);
  // Redux
  // const dispatch = useDispatch();

  // const handleBackClick = () => {
  //     dispatch(hideInterest());
  // };

  // Declaration for Bookmarking Profile
  // Declaration for Bookmarking Profile
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<ProfileData[]>(
    () => {
      const savedBookmarks = localStorage.getItem("bookmarkedProfiles");
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    }
  );
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileData[]>(
    () => {
      const savedSelectedProfiles = localStorage.getItem("selectedProfiles");
      return savedSelectedProfiles ? JSON.parse(savedSelectedProfiles) : [];
    }
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
          "http://103.214.132.20:8000/auth/Get_profile_det_match/",
          {
            profile_id: loginuser_profileId,
            user_profile_id: idparam,
          }
        );
        setProfileData(response.data);
        if (response.data.basic_details.express_int === "1") {
          setIsHeartMarked(true);
        }

        const isAlreadyBookmarked = bookmarkedProfiles.some(
          (profile) =>
            profile.basic_details.profile_id ===
            response.data.basic_details.profile_id
        );
        setIsBookmarked(isAlreadyBookmarked);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [idparam, loginuser_profileId, bookmarkedProfiles]);

  useEffect(() => {
    localStorage.setItem(
      "bookmarkedProfiles",
      JSON.stringify(bookmarkedProfiles)
    );
  }, [bookmarkedProfiles]);

  useEffect(() => {
    localStorage.setItem("selectedProfiles", JSON.stringify(selectedProfiles));
  }, [selectedProfiles]);

  const addBookmark = async (profile: ProfileData) => {
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Mark_profile_wishlist/",
        {
          profile_id: loginuser_profileId,
          profile_to: idparam,
          status: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile added Bookmark Successfully");
      }
      if (response.data.Status === 1) {
        setBookmarkedProfiles((prev) => [...prev, profile]);
        setSelectedProfiles((prev) => [...prev, profile]);
        setIsBookmarked(true);
        console.log(
          `Profile ${profile.basic_details.profile_id} bookmarked successfully with status 1.`
        );
      } else {
        console.log("Failed to bookmark profile:", response.data.Message);
      }
    } catch (error) {
      console.error("Error bookmarking profile:", error);
    }
  };

  const removeBookmark = async (profile_id: string) => {
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Mark_profile_wishlist/",
        {
          profile_id: loginuser_profileId,
          profile_to: idparam,
          status: "0",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.Status === 1) {
        toast.error("Profile Removed from Bookmark Successfully");
        setBookmarkedProfiles((prev) => {
          console.log("Previous bookmarked profiles:", prev);

          return prev.filter((profile) => {
            if (!profile || !profile.basic_details) {
              console.error("Malformed profile object:", profile);
              return false; // Skip malformed profile objects
            }
            return profile.basic_details.profile_id !== profile_id;
          });
        });

        setSelectedProfiles((prev) => {
          console.log("Previous selected profiles:", prev);

          return prev.filter((profile) => {
            if (!profile || !profile.basic_details) {
              console.error("Malformed profile object:", profile);
              return false; // Skip malformed profile objects
            }
            return profile.basic_details.profile_id !== profile_id;
          });
        });

        setIsBookmarked(false);
        console.log(
          `Profile ${profile_id} removed from bookmarks successfully with status 0.`
        );
      } else {
        console.log("Failed to remove bookmark:", response.data.Message);
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked && profileData) {
      removeBookmark(profileData.basic_details.profile_id);
    } else if (profileData) {
      addBookmark(profileData);
    }
  };

  // Declaration for Heart State
  const [isHeartMarked, setIsHeartMarked] = useState(false);

  const [openCustomMsgShow, setOpenCustomMsgShow] = useState<boolean>(false);
  const [openCustomMsg, setOpenCustomMsg] = useState<string>("");

  console.log(openCustomMsg, "openCustomMsg");
  console.log(openCustomMsg, "setOpenCustomMsg");

  const [selectValue, setSelectValue] = useState<string>("");

  const handleHeartMark = async () => {
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Send_profile_intrests/",
        {
          profile_id: loginuser_profileId,
          profile_to: idparam,
          status: !isHeartMarked ? "1" : "0",
          to_express_message: openCustomMsg || selectValue, // Use message if provided, otherwise use an empty string
        }
      );

      if (response.status === 200) {
        setIsHeartMarked(!isHeartMarked);

        // Toast Notification
        if (!isHeartMarked) {
          toast.success("Your express interest has been sent successfully!");
        } else {
          toast.success("Your express interest has been removed successfully!");
        }
      } else {
        // Toast Notification
        // alert("Failed to update express interest");
        toast.error("Failed to update express interest");

        console.error("Failed to update express interest");
      }
    } catch (error) {
      // Toast Notification
      NotifyError("Error updating express interest");

      console.error("Error updating express interest:", error);
    } finally {
      setOpenCustomMsg("");
      setSelectValue("");
    }
  };

  useEffect(() => {
    if (openCustomMsg || selectValue) {
      handleHeartMark();
    }
  }, [openCustomMsg, selectValue]);

  const openMsgPopUp = () => {
    setOpenCustomMsgShow(true);
  };

  // Declaration for Horoscope State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const sendPhotoRequest = async () => {
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Send_photo_request/",
        {
          profile_id: loginuser_profileId,
          profile_to: profileData?.basic_details.profile_id,
          status: 1,
        }
      );
      if (response.status >= 200 || response.status >= 204) {
        NotifySuccess("Your photo interest request has been sent successfully!");
      } else {
        NotifyError("Something went wrong, please try again later");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Error sending photo request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const toggleDropdown = () => {
  //     setIsOpen(!isOpen);
  // };


  const generatePoruthamPDF = async () => {
    console.log("aaaaaaaaaaaaaaa", loginuser_profileId);
    console.log("bbbbbbbbbbbbbb", idparam);
    try {
      const response = await axios.post('https://apiupg.rainyseasun.com/auth/generate-porutham-pdf/', {
        profile_from: loginuser_profileId,
        profile_to: idparam
      }, {
        responseType: 'blob', // Important for downloading binary data like PDF
      });

      if (response.status === 200) {
        // Create a Blob from the PDF binary data
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        // Set the download attribute with the file name
        link.href = url;
        link.setAttribute('download', 'Porutham.pdf'); // Set your file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Remove the link element

        console.log('PDF generated and downloaded successfully');
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error generating PDF:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post('http://103.214.132.20:8000/auth/Get_prof_list_match/', {
          profile_id: loginuser_profileId,
        });
        // Assuming the response data is in response.data
        // setArrayValues(response.data);
        console.log("profileids", response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [loginuser_profileId]);

  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
    handleDownloadPdf();
    setIsOpen(false);
  };

  // Personal Notes Popup
  const [showPersonalNotes, setShowPersonalNotes] = useState(false);
  const handlePersonalNotesPopup = () => {
    setShowPersonalNotes(!showPersonalNotes);
  };

  const closePersonalNotesPopup = () => {
    setShowPersonalNotes(false);
  };

  // Personal Notes Popup
  const [showVysassist, setShowVysassist] = useState(false);
  // const navigate = useNavigate();
  const handleVysassistpopup = () => {
    setShowVysassist(!showVysassist);
  };

  const closeVysassistpopup = () => {
    setShowVysassist(false);
  };



  const [isShareVisible, setIsShareVisible] = useState(false);

  const toggleShareVisibility = () => {
    setIsShareVisible(!isShareVisible);
  };

  // const closeShareModal = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if ((e.target as HTMLElement).className.includes("modal-overlay")) {
  //     setIsShareVisible(false);
  //   }
  // };

  useEffect(() => {
    if (storedPlanId === "0") {
      navigate("/MembershipPlan");
    }
  }, [storedPlanId]);

  // Horoscope Download Function
  const handleDownloadPdf = () => {
    const link = document.createElement("a");
    link.href = `https://apiupg.rainyseasun.com/auth/generate-pdf/${loginuser_profileId}/${idparam}`;
    link.download = `pdf_${idparam}.pdf`; // Customize the file name
    link.click();
  };

  const horoscopeLink = profileData?.basic_details.horoscope_link

  return (
    <div>
      <div className="bg-grayBg pt-10">
        <div className="container mx-auto">
          <div className="flex items-center mb-5">
            {/* <IoArrowBackOutline onClick={handleBackClick} className="text-[24px] mr-2 cursor-pointer" /> */}
            <h4 className="text-[24px] text-vysyamalaBlackSecondary font-bold">
              {" "}
              Profile Details
              {/* <span className="text-sm text-primary"> (234)</span> */}
            </h4>
          </div>

          <div className="grid grid-rows-1 grid-cols-3 justify-start items-center space-x-10 my-5">
            <div>
              <ProfileSlickView
                // GetProfileDetMatch={GetProfileDetMatch}
                profileId={profileData?.basic_details.profile_id}
                photoLock={PhotoPasswordlock}
              />

            </div>

            {/* Profile Details */}
            <div className="col-span-2">
              <div className="flex justify-between items-center">
                <div className="">
                  <h4 className="flex items-center text-[30px] text-secondary font-bold mb-2">
                    {profileData?.basic_details.profile_name}

                    {profileData?.basic_details.verified === 1 && (
                      <MdVerifiedUser className="text-checkGreen ml-2" />
                    )}
                  </h4>
                </div>

                {/* Icons */}
                <div className="flex justify-center items-center space-x-10">
                  <div>
                    <IoShareSocialSharp
                      title="Share Profile"
                      className="text-[22px] text-vysyamalaBlack cursor-pointer"
                      onClick={toggleShareVisibility}
                    />

                    {/* Share Component here */}
                    {isShareVisible && (
                      // <Share closePopup={toggleShareVisibility} />
                      <Share
                        closePopup={toggleShareVisibility}
                        profileId={profileData?.basic_details.profile_id}
                        profileName={profileData?.basic_details.profile_name}
                        age={profileData?.personal_details.age}
                        starName={profileData?.horoscope_details.star_name}
                      />
                    )}
                  </div>

                  <div>
                    {/* <MdBookmarkBorder title="Bookmark Profile" className="text-[22px] text-vysyamalaBlack cursor-pointer" /> */}
                    {isBookmarked ? (
                      <MdBookmark
                        title="Wishlist this Profile"
                        onClick={handleBookmark}
                        className="text-[22px] text-vysyamalaBlack cursor-pointer"
                      />
                    ) : (
                      <MdBookmarkBorder
                        title="Wishlist this Profile"
                        onClick={handleBookmark}
                        className="text-[22px] text-vysyamalaBlack cursor-pointer"
                      />
                    )}
                  </div>

                  <div>
                    <IoDocumentText
                      onClick={handlePersonalNotesPopup}
                      title="Personal Notes"
                      className="text-[22px] text-vysyamalaBlack cursor-pointer"
                    />
                    {showPersonalNotes && (
                      <PersonalNotesPopup
                        closePopup={closePersonalNotesPopup}
                        profileId={""}
                        profileTo={""}
                      />
                    )}
                  </div>

                  <div>
                    <TbPhotoHeart
                      onClick={() => sendPhotoRequest()}
                      title="Send Photo Request"
                      className="text-[22px] text-vysyamalaBlack cursor-pointer"
                    />
                  </div>

                  <div>
                    <BiSolidUserVoice
                      onClick={handleVysassistpopup}
                      title="Vys Assist"
                      className="text-[22px] text-vysyamalaBlack cursor-pointer"
                    />
                    {showVysassist && (
                      <VysAssistPopup closePopup={closeVysassistpopup} />
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[20px] text-primary font-bold mb-2">
                {profileData?.basic_details.profile_id}
              </p>

              <div className="flex justify-between items-center">
                {/* Profile Details Content */}
                <div>
                  {/* Age & height */}
                  <div className="flex justify-between items-center mb-2">
                    {/* {profileData?.personal_details?.age&& profileData.personal_details.age == "" && profileData.personal_details.age == null && ( */}
                    {profileData?.personal_details?.age && profileData.personal_details.age !== null && (
                    <h5 className="text-[18px] text-ash font-semibold">
                      Age :
                      <span className="font-normal">
                        {" "}
                        {profileData?.personal_details.age} years
                      </span>
                    </h5>
                       )}
                    {/* )} */}


                    {profileData?.personal_details?.height && profileData.personal_details.height !== "" && profileData.personal_details.height !== null && (
                    <h5 className="text-[18px] text-ash font-semibold mb-2">
                      Heighttt :
                      <span className="font-normal">
                        {" "}
                        {profileData?.personal_details.height} cms
                      </span>
                    </h5>
                       )}
                  </div>

                  {/* <h5 className="text-[18px] text-ash font-semibold mb-2">
                    Weight :
                    <span className="font-normal">
                      {" "}
                      {profileData?.personal_details.weight} kg
                    </span>
                  </h5> */}

                  {profileData?.personal_details?.weight && profileData.personal_details.weight !== "" && profileData.personal_details.weight !== null && (
                    <h5 className="text-[18px] text-ash font-semibold mb-2">
                      Weight:
                      <span className="font-normal">
                        {profileData.personal_details.weight} kg
                      </span>
                    </h5>
                  )}





                  {/* Star & Gothram */}
                  <div className="flex justify-between items-center mb-2">
                  {profileData?.horoscope_details?.star_name && profileData.horoscope_details.star_name !== "" && profileData.horoscope_details.star_name !== null && (
                    <h5 className="text-[18px] text-ash font-semibold">
                      Star :
                      <span className="font-normal">
                        {" "}
                        {profileData?.horoscope_details.star_name}
                      </span>
                    </h5>
                       )}

{profileData?.horoscope_details?.surya_gothram && profileData.horoscope_details.surya_gothram !== "" && profileData.horoscope_details.surya_gothram !== null && (
                    <h5 className="text-[18px] text-ash font-semibold mb-2">
                      Gothram :
                      <span className="font-normal">
                        {" "}
                        {profileData?.horoscope_details.surya_gothram}
                      </span>
                    </h5>
                       )}
                  </div>

                  {profileData?.education_details.profession && profileData.education_details.profession !== "" && profileData.education_details.profession !== null && (
                  <h5 className="text-[18px] text-ash font-semibold mb-2">
                    Profession :
                    <span className="font-normal">
                      {" "}
                      {profileData?.education_details.profession}
                    </span>
                  </h5>
                     )}

{profileData?.education_details.education_level && profileData.education_details.education_level !== "" && profileData.education_details.education_level !== null && (
                  <h5 className="text-[18px] text-ash font-semibold mb-2">
                    Education :
                    <span className="font-normal">
                      {" "}
                      {profileData?.education_details.education_level}
                    </span>
                  </h5>)}

  {profileData?.basic_details.about && profileData.basic_details.about !== "" && profileData.basic_details.about !== null && (
                  <h5 className="text-[18px] text-ash font-semibold mb-2">
                    About :
                    <span className="font-normal">
                      {" "}
                      {profileData?.basic_details.about}
                    </span>
                  </h5>)}

                  <div className="flex justify-start items-center space-x-3 mt-3">
                    {/* Horoscope Available */}
                    <div>
                      <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                        <MdOutlineGrid3X3 className="mr-2" />  {profileData?.basic_details.horoscope_available_text}

                      </p>
                    </div>

                    {/*  Active User */}
                    <div>
                      <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                        <FaUser className="mr-2" /> {profileData?.basic_details.user_status}
                      </p>
                    </div>

                    {/* Last Visit */}
                    <div>
                      <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                        <IoCalendar className="mr-2" /> Last visit on {profileData?.basic_details.last_visit}                      </p>
                    </div>

                    {/* views */}
                    <div>
                      <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                        <IoEye className="mr-2" />{" "}
                        {profileData?.basic_details.user_profile_views} views
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matching Meter */}
                <div onClick={() => generatePoruthamPDF()} title="Click to download pdf">
                  <MatchingScore
                    scorePercentage={profileData?.basic_details?.matching_score}
                  />
                </div>

              </div>
              {openCustomMsgShow ? (
                <CustomMessagePopUp
                  custom_message={custom_message}
                  setOpenCustomMsgShow={setOpenCustomMsgShow}
                  setOpenCustomMsg={setOpenCustomMsg}
                  setSelect={setSelectValue}
                />
              ) : (
                ""
              )}
              <div className="flex justify-between items-center mt-10 mb-3">
                <div>
                  {/* Buttons */}

                  {interestParam !== "1" && status !== 2 && status !== 3 && loginuser_profileId && (
                    <div className="flex justify-start items-center space-x-5 my-5">
                      <button
                        onClick={
                          custom_message && !isHeartMarked
                            ? openMsgPopUp
                            : handleHeartMark
                        }
                        className="bg-gradient text-white flex items-center rounded-md px-5 py-3 cursor-pointer"
                      >
                        <FaHeart
                          className={`text-[22px] mr-2 ${isHeartMarked ? "text-red-500" : "text-gray-400"
                            }`}
                        />
                        {isHeartMarked
                          ? "Remove from Interest"
                          : "Express Interest"}

                        {/* Toast Notifications */}
                      </button>
                      {profileData?.basic_details.horoscope_available === 1 && (
                        <a

                          href={horoscopeLink}  // Replace with your actual URL
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-white text-main flex items-center rounded-md border-2 px-5 py-2.5 cursor-pointer">
                            <FaTableList className="text-[22px] mr-2" /> Horoscope
                          </button>
                        </a>
                      )}
                    </div>
                  )}

                  {status === 2 ? (
                    // Show message button if numericStatus >= 2
                    <Link to="/Messages">
                      <button onClick={handleMessageClick} className="text-main flex items-center rounded-lg px-5 py-2.5 cursor-pointer">
                        <MdMessage className="text-[26px] mr-2" /> Message
                      </button>
                    </Link>
                  ) : (
                    // Show the interest buttons and message button if numericStatus < 2
                    interestParam === "1" && loginuser_profileId && status !== 3 && status !== 2 && (
                      <div className="flex justify-start items-center space-x-5 my-5">
                        {/* Accept button */}
                        {hideExpresButton ? (
                          <>
                            <button
                              onClick={() => handleUpdateInterest(idparam, "2")}
                              className="bg-checkGreen text-white flex items-center rounded-lg px-5 py-3 cursor-pointer"
                            >
                              <FaCheckCircle className="text-[22px] mr-2" /> Accept
                            </button>
                            {/* Decline button */}
                            <button
                              onClick={() => handleUpdateInterest(idparam, "3")}
                              className="bg-white text-main flex items-center rounded-lg border-2 px-5 py-2.5 cursor-pointer"
                            >
                              <IoMdCloseCircle className="text-[26px] mr-2" /> Decline
                            </button>
                          </>
                        ) : null}
                        {/* Message button */}

                      </div>
                    )
                  )}

                  {status === 3 && (
                    <p>Your Interest has been rejected</p>
                  )}

                  {/* <div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 || loading}
                        className="text-main flex items-center rounded-lg px-5 py-2.5 cursor-pointer bg-gray-200"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentIndex === profileIds.length - 1 || loading}
                        className="text-main flex items-center rounded-lg px-5 py-2.5 cursor-pointer bg-gray-200"
                      >
                        Next
                      </button>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                  </div> */}


                </div>

                <div
                  className="flex justify-center items-center space-x-10"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative">
                    <p className="flex items-center text-ash cursor-pointer">
                      <MdLocalPrintshop className="text-[22px] mr-2" />
                      Print Horoscope
                      <MdArrowDropDown className="text-[22px] ml-2" />
                    </p>

                    {(isHovered || isOpen) && (
                      <div
                        className="absolute top-4 right-0 mt-2 w-40 bg-white rounded-md shadow-lg"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                      >
                        <ul>
                          <li
                            className="block px-4 py-2 text-gray-800 hover:bg-gray cursor-pointer"
                            onClick={() => handleSelectLanguage("Tamil")}
                          >
                            Tamil
                          </li>
                          <li
                            className="block px-4 py-2 text-gray-800 hover:bg-gray cursor-pointer"
                            onClick={() => handleSelectLanguage("English")}
                          >
                            English
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {selectedLanguage && (
                    <p className="ml-4 text-ash">
                      Selected: {selectedLanguage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ProfileDetailsSettingsView />
            <FeaturedProfiles />
            <VysyaBazaar />
            <SuggestedProfiles /> */}
    </div>
  );
};
