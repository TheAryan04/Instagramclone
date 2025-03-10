import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useGetStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/v2/stories/userstories/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          setStories(res.data.stories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStories();
  }, [user]);

  return { stories, loading };
};

export default useGetStories;
