import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    useEffect(() =>{
        const fetchUserProfile = async () => {
            try {
                console.log("Fetching profile for:", userId);
                const res = await axios.get(`http://localhost:5000/api/v2/user/${userId}/profile`, {withCredentials:true});
                console.log("API Response:", res.data);
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [dispatch, userId]);
};
export default useGetUserProfile;