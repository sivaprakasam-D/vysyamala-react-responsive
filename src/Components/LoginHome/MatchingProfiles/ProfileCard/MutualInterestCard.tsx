import { useState, useEffect } from "react";
import axios from "axios";
import ProfileListImg from "../../../../assets/images/ProfileListImg.png";
import { MdVerifiedUser, MdBookmark, MdBookmarkBorder, MdOutlineGrid3X3 } from "react-icons/md";
import { IoCalendar, IoEye } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import MatchingScoreImg from "../../../../assets/images/MatchingScore.png";
import { Link } from "react-router-dom";
import { MdStars } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

// Define the Profile interface
export interface Profile {
  mutint_Profile_img: string;
  mutint_profile_name: string;
  mutint_profileid: string;
  mutint_profile_age: number;
  horoscope_available: boolean;
  user_status: string;
  last_visit: string;
  profile_views: number;
}

export const MutualInterestCard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loginuser_profileId = sessionStorage.getItem('loginuser_profile_id');


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.post("http://103.214.132.20:8000/auth/Get_mutual_intrests/", {
          profile_id: loginuser_profileId // Replace with actual profile_id as needed
        });

        if (response.data.Status === 1) {
          const profilesArray = response.data.data.profiles;
          setProfiles(profilesArray);
        } else {
          setError("No Data Found");
        }
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("Unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleBookmark = (profileId: string) => {
    setIsBookmarked((prev) => ({
      ...prev,
      [profileId]: !prev[profileId],
    }));
  };

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profiles.length) {
    return <p>No profiles available.</p>;
  }

  return (
    <div className="border-b-[1px] border-footer-text-gray">
      {profiles.map((profile) => (
        <div key={profile.mutint_profileid} className="flex justify-start items-center space-x-5 relative rounded-xl shadow-sm py-5">
          <Link to="/ProfileDetails" className="w-full flex justify-between items-center">
            <div className="flex justify-between items-center space-x-5">
              {/* Profile Image */}
              <div className="relative">
                <img src={profile.mutint_Profile_img || ProfileListImg} alt="Profile image" />
                {isBookmarked[profile.mutint_profileid] ? (
                  <MdBookmark
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookmark(profile.mutint_profileid);
                    }}
                    className="absolute top-2 right-2 text-white text-[22px] cursor-pointer"
                  />
                ) : (
                  <MdBookmarkBorder
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookmark(profile.mutint_profileid);
                    }}
                    className="absolute top-2 right-2 text-white text-[22px] cursor-pointer"
                  />
                )}
              </div>

              {/* Profile Details */}
              <div className="">
                {/* Name & Profile ID */}
                <div className="relative mb-2">
                  <div className="flex items-center">
                    <h5 className="text-[20px] text-secondary font-semibold cursor-pointer mr-2">
                      {profile.mutint_profile_name || "Unknown"}
                    </h5>
                    <span className="text-sm text-ashSecondary mr-2">
                      ({profile.mutint_profileid || "N/A"})
                    </span>
                    <MdVerifiedUser className="text-checkGreen" />
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center space-x-3 mb-2">
                  <p className="flex items-center text-ashSecondary font-semibold">
                    <IoCalendar className="mr-2" />
                    {profile.mutint_profile_age || "N/A"} yrs
                  </p>
                </div>

                {/* Other Details */}
                <div className="mb-2">
                  <p className="flex items-center text-ashSecondary font-semibold">
                    <MdStars className="mr-2" />
                    Uthiram
                  </p>
                </div>
                <div className="mb-2">
                  <p className="flex items-center text-ashSecondary font-semibold">
                    <IoSchool className="mr-2" />
                    Bachelors - Arts/Science/Commerce/B Phil
                  </p>
                </div>
                <div className="mb-2">
                  <p className="flex items-center text-ashSecondary font-semibold">
                    <FaSuitcase className="mr-2" />
                    Employed
                  </p>
                </div>
                <div className="mb-2">
                  <p className="flex items-center text-ashSecondary font-semibold">
                    <FaLocationDot className="mr-2" />
                    Chennai
                  </p>
                </div>

                {/* Tags */}
                <div className="flex justify-start items-center space-x-3">
                  <div>
                    <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                      <MdOutlineGrid3X3 className="mr-2" /> Horoscope Available
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                      <FaUser className="mr-2" /> {profile.user_status}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                      <IoCalendar className="mr-2" /> Last visit on {profile.last_visit}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center bg-gray px-2 py-0.5 rounded-md text-ashSecondary font-semibold">
                      <IoEye className="mr-2" /> {profile.profile_views} views
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Matching Score */}
            <div>
              <img
                src={MatchingScoreImg}
                alt="Matching Score"
                className="w-full"
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
