import { useTranslation } from "react-i18next";
import VideoBanner from "./Components/VideoBanner";
import Introduction from "./Components/Introduction";
import FeaturedActivities from "./Components/FeaturedActivities";
import Statistics from "./Components/Statistics";
import Sponsors from "./Components/Sponsors";
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";
import Donate from "./Components/Donate";

const apiUrl = import.meta.env.VITE_API_URL; 
export default function Home() {
    const [types, setTypes] = useState([]);
    const [sponsors, setSponsors] = useState([]);

    async function getSponsors() {
        try {
            const res = await fetch(`${apiUrl}/api/sponsors`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            setSponsors(data);
        } catch (error) {
            console.error("Failed to fetch sponsors:", error);
        }
    }

    async function getTypes() {
        try {
            const res = await fetch(`${apiUrl}/api/types`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            setTypes(data);
        } catch (error) {
            console.error("Failed to fetch types:", error);
        }
    }

    useEffect(() => {
        getTypes();
        getSponsors();
    }, []);

    return (
        <>
            <VideoBanner bannerImage={'/tagemi_consept.jpg'} bannerText={''} homePage={true}/>
            <Introduction />
            <FeaturedActivities />
            {sponsors.length > 0 && <Statistics />}
            {/* <Sponsors /> */}
            <Donate />
            <Footer types={types} />
        </>
    );
}
