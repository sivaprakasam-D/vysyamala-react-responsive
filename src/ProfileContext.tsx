import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";

export interface Profile {
  profile: any;
  profile_id: string;
  profile_name: string;
  profile_img: string;
  profile_age: number;
  profile_gender?: string; // Optional properties
  height?: string;
  weight?: string;
  degree?: string;
  profession?: string;
  location?: string;
  profile_image?: string;
  wish_list?: string;
  user_profile_views?: string;
}

export interface DashboardDetails {
  mutual_int_count: number;
  wishlist_count: number;
  personal_notes_count: number;
  received_int_count: number;
  sent_int_count: number;
  myvisitor_count: number;
  viewed_profile_count: number;
  profile_details: {
    profile_id: string;
    profile_name: string;
    package_name: string | null;
    package_validity: string | null;
    completion_per: string;
    profile_image: string;
  };
}

interface ProfileContextType {
  bookmarkedProfiles: Profile[];
  selectedProfiles: Profile[];
  error: string | null;
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
  addBookmark: (profile: Profile) => void;
  removeBookmark: (profileId: string) => void;
  setSelectedProfiles: (profiles: Profile[]) => void;
  dashboardDetails: DashboardDetails | null;
  fetchDashboardDetails: () => void;
  perPage: number;
  pageNumber: number;
  totalCount: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
  setTotalCount: Dispatch<SetStateAction<number>>;
  fromAge: number;
  fromHeight: number;
  toHeight: number;
  ToAge: number;
  setFromAge: Dispatch<SetStateAction<number>>;
  setToAge: Dispatch<SetStateAction<number>>;
  setFromHeight: Dispatch<SetStateAction<number>>;
  setToHeight: Dispatch<SetStateAction<number>>;
  MatchingProfileperPage: number;
  MatchingProfilepageNumber: number;
  MatchingProfiletotalCount: number;
  setMatchingProfilePerPage: Dispatch<SetStateAction<number>>;
  setMatchingProfilePageNumber: Dispatch<SetStateAction<number>>;
  setMatchingProfileTotalCount: Dispatch<SetStateAction<number>>;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  setSearchProfileData: Dispatch<SetStateAction<string>>;
  searchProfileData: any;
  setMatchingProfileSearchId: Dispatch<SetStateAction<string>>;
  matchingProfileSearchId: string
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<Profile[]>(
    () => {
      const savedBookmarks = localStorage.getItem("bookmarkedProfiles");
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    }
  );

  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>(() => {
    const savedSelectedProfiles = localStorage.getItem("selectedProfiles");
    return savedSelectedProfiles ? JSON.parse(savedSelectedProfiles) : [];
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Function to toggle the sort order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  const [searchProfileData, setSearchProfileData] = useState<any>([]); //advance search page search by id

  const [perPage, setPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [fromAge, setFromAge] = useState<number>(0);
  const [ToAge, setToAge] = useState<number>(0);
  const [fromHeight, setFromHeight] = useState<number>(0);
  const [toHeight, setToHeight] = useState<number>(0);

  //matching profile
  const [MatchingProfileperPage, setMatchingProfilePerPage] =
    useState<number>(20);
  const [MatchingProfilepageNumber, setMatchingProfilePageNumber] =
    useState<number>(1);
  const [MatchingProfiletotalCount, setMatchingProfileTotalCount] =
    useState<number>(0);
  const [matchingProfileSearchId, setMatchingProfileSearchId] = useState<string>("")

  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [dashboardDetails, setDashboardDetails] =
    useState<DashboardDetails | null>(null);
  const loginuser_profileId = sessionStorage.getItem("loginuser_profile_id");

  const fetchDashboardDetails = async () => {
    if (!loginuser_profileId) {
      setError("No profile ID found in session.");
      return;
    }
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Get_dashboard_details/",
        {
          profile_id: loginuser_profileId,
        }
      );

      if (response.data.Status === 1) {
        setDashboardDetails(response.data.data);
      } else {
        setError(`Error fetching dashboard details: ${response.data.Message}`);
      }
    } catch (error) {
      setError("Error fetching dashboard details. Please try again.");
      console.error("Error fetching dashboard details:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "bookmarkedProfiles",
      JSON.stringify(bookmarkedProfiles)
    );
  }, [bookmarkedProfiles]);

  useEffect(() => {
    localStorage.setItem("selectedProfiles", JSON.stringify(selectedProfiles));
  }, [selectedProfiles]);

  const addBookmark = async (profile: Profile) => {
    if (!loginuser_profileId) {
      setError("No profile ID found in session.");
      return;
    }
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Mark_profile_wishlist/",
        {
          profile_id: loginuser_profileId,
          profile_to: profile.profile_id,
          status: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.Status === 1) {
        setBookmarkedProfiles((prev) => [...prev, profile]);
        console.log(`Profile ${profile.profile_id} bookmarked successfully.`);
      } else {
        setError(`Failed to bookmark profile: ${response.data.Message}`);
      }
    } catch (error) {
      setError("Error bookmarking profile. Please try again.");
      console.error("Error bookmarking profile:", error);
    }
  };

  const removeBookmark = async (profileId: string) => {
    if (!loginuser_profileId) {
      setError("No profile ID found in session.");
      return;
    }
    try {
      const response = await axios.post(
        "http://103.214.132.20:8000/auth/Mark_profile_wishlist/",
        {
          profile_id: loginuser_profileId,
          profile_to: profileId,
          status: "0",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.Status === 1) {
        setBookmarkedProfiles((prev) =>
          prev.filter((profile) => profile.profile_id !== profileId)
        );
        setSelectedProfiles((prev) =>
          prev.filter((profile) => profile.profile_id !== profileId)
        );
        console.log(
          `Profile ${profileId} removed from bookmarks successfully.`
        );
      } else {
        setError(`Failed to remove bookmark: ${response.data.Message}`);
      }
    } catch (error) {
      setError("Error removing bookmark. Please try again.");
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        bookmarkedProfiles,
        selectedProfiles,
        error,
        selectedProfile,
        setSelectedProfile,
        addBookmark,
        removeBookmark,
        setSelectedProfiles,
        dashboardDetails,
        fetchDashboardDetails,
        perPage,
        pageNumber,
        totalCount,
        setPerPage,
        setPageNumber,
        setTotalCount,
        fromAge,
        fromHeight,
        toHeight,
        ToAge,
        setFromAge,
        setToAge,
        setFromHeight,
        setToHeight,
        MatchingProfileperPage,
        MatchingProfilepageNumber,
        MatchingProfiletotalCount,
        setMatchingProfilePerPage,
        setMatchingProfilePageNumber,
        setMatchingProfileTotalCount,
        sortOrder,
        toggleSortOrder,
        searchProfileData,
        setSearchProfileData,
        setMatchingProfileSearchId,
        matchingProfileSearchId,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};