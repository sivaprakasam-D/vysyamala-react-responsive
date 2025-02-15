import { useState, useEffect, useRef } from "react";
import { IoMdLock } from "react-icons/io";
import Slider from "react-slick";
import {
  fetchProfilesDetails,
  Get_photo_bypassword,
} from "../../../commonapicall"; // Adjust the path as needed
import "./ProfileSlickStyleView.css";
import axios from "axios";
import { GoAlertFill } from "react-icons/go";
import {
  ToastNotification,
  NotifyError,
  NotifySuccess,
} from "../../Toast/ToastNotification";
import Spinner from "../../Spinner";

interface UserImages {
  [key: string]: string;
}

interface ProfileSlickViewProps {
  profileId?: string;
  photoLock: number;
}

export const ProfileSlickView: React.FC<ProfileSlickViewProps> = ({
  profileId,
  photoLock,
}) => {
  const loginuser_profileId =
    sessionStorage.getItem("loginuser_profile_id") || "";
  const [userImages, setUserImages] = useState<UserImages>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const [popupPassword, setPopPassword] = useState<boolean>(false);
  const [photoPassword, setPhotoPassword] = useState<string>("");
  const [PhotoPasswordlock, setPhotoPasswordlock] = useState<number>(1);
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);

  // Image Zoom Effect
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const handleMouseEnter = (image: string) => {
    setTimeout(() => setZoomImage(image), 100);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setZoomImage(null), 100);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        if (profileId) {
          const data = await fetchProfilesDetails(profileId);
          const { user_images } = data;
          setUserImages(user_images);
          setError(null);
        } else {
          // setError("Profile ID is not defined.");
        }
      } catch (error: any) {
        setError("Error fetching profiles");
        console.error(
          "Error fetching profiles:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (loginuser_profileId) {
      fetchProfileData();
    }
  }, [profileId, loginuser_profileId]);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  const GetPhotoByPassword = async (Password: string) => {
    try {
      const response = await axios.post(Get_photo_bypassword, {
        profile_id: loginuser_profileId,
        profile_to: id,
        photo_password: Password,
      });

      if (response.status === 200) {
        const userImages = response.data.data.user_images;
        sessionStorage.setItem(`userImages_${id}`, JSON.stringify(userImages));
        NotifySuccess("Photo fetched successfully");
        sessionStorage.removeItem("photolock");
        sessionStorage.setItem("photolockval", JSON.stringify(response.data.photo_protection));
        const storedPhotoString = sessionStorage.getItem("photolockval");
        const storedPhoto = storedPhotoString ? JSON.parse(storedPhotoString) : 0;
        const photoPasswordLockNumber = Number(storedPhoto);
        setPhotoPasswordlock(photoPasswordLockNumber);
      }
    } catch (error) {
      NotifyError("Please Enter Correct Password");
      console.error("Please Enter Correct Password");
    } finally {
      setPopPassword(false);
    }
  };

  const handleSubmitPassword = async () => {
    await GetPhotoByPassword(photoPassword);
    setPopPassword(false);
  };

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const storedProtectedImg = sessionStorage.getItem(`userImages_${id}`);
  const sessionImage: string[] = storedProtectedImg
    ? JSON.parse(storedProtectedImg)
    : [];

  const images = Object.values(storedProtectedImg ? sessionImage : userImages);
console.log(sessionImage ,"sessionImg")
  return (
    <div>
      {loading && <Spinner />}
      {error && <div className="error-message">{error}</div>}
      <div className="relative profileSliderStyle">
        {images.length === 1 ? (
          <div className="profile-slider-img-container">
            <img
              src={images[0]}
              className="w-full rounded-lg profile-slider-img"
              alt="Single Image"
              onMouseEnter={() => handleMouseEnter(images[0])}
              onMouseLeave={handleMouseLeave}
            />
            {photoLock === 1 && PhotoPasswordlock === 1 &&  (
              <div
                onClick={() => setPopPassword(true)}
                className="text-center lock-style"
              >
                <IoMdLock className="w-fit mx-auto text-secondary text-[50px]" />
                <p className="text-sm text-white font-semibold">
                  Click here to request password to view profile photo
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <Slider
              customPaging={(i: number) => (
                <a>
                  <img
                    src={images[i] || ""}
                    alt={`Thumbnail ${i + 1}`}
                    className="rounded-lg"
                  />
                </a>
              )}
              dots={false}
              arrows={false}
              dotsClass="slick-dots slick-thumb"
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              asNavFor={nav2 as Slider}
              ref={(slider) => (sliderRef1.current = slider)}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`profile-slider-img-container ${photoLock === 0 || PhotoPasswordlock === 0   ? "" :!storedProtectedImg? "fade-img-effect":""}`}

                  onMouseEnter={() => handleMouseEnter(image)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={image}
                    className="w-full rounded-lg profile-slider-img"
                    alt={`Slide ${index + 1}`}
                  />
                  {photoLock === 1 && PhotoPasswordlock === 1 && !storedProtectedImg && (
                    <div
                      onClick={() => setPopPassword(true)}
                      className="text-center lock-style"
                    >
                      <IoMdLock className="w-fit mx-auto text-secondary text-[50px]" />
                      <p className="text-sm text-white font-semibold">
                        Click here to request password to view profile photo
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </Slider>

            <Slider
              dots={false}
              slidesToShow={5}
              swipeToSlide={true}
              focusOnSelect={true}
              asNavFor={nav1 as Slider}
              ref={(slider) => (sliderRef2.current = slider)}
              className="connectingSlick"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="profile-slider-img-container"
                  onMouseEnter={() => handleMouseEnter(image)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={image}
                    className="w-20 mx-auto my-5 rounded-lg"
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </Slider>
          </>
        )}

        {/* Password Input Popup */}
        {popupPassword && (
          <div className="absolute left-10 top-40 w-10/12 rounded-lg">
            <div
              aria-labelledby="modal-headline"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full bg-white rounded-lg px-4 py-4">
                <div className="space-y-3">
                  {/* Label Text & Icon */}
                  <div className="flex items-start space-x-2">
                    <GoAlertFill className="text-[22px] text-secondary" />
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Enter Password to View Photo
                    </label>
                  </div>
                  <div>
                    <input
                      required
                      onChange={(e) => setPhotoPassword(e.target.value)}
                      type="text"
                      placeholder="Enter The Password"
                      className="w-full bg-gray rounded-md px-2 py-2 focus-within:outline-none"
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-secondary flex items-center rounded-lg font-semibold px-5 py-                      2.5 cursor-pointer"
                      onClick={() => setPopPassword(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-white font-semibold bg-secondary rounded-md px-5 py-2.5 cursor-pointer"
                      onClick={handleSubmitPassword}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {zoomImage && (
        <div className="zoomed-image-container zoomed-visible">
          <img src={zoomImage} className="zoomed-image" alt="Zoomed" />
        </div>
      )}
      <ToastNotification />
    </div>
  );
};

