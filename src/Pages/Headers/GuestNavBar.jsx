import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import 'flag-icons/css/flag-icons.min.css'; // Import flag-icons CSS
import LanguageSelector from "../../LanguageSelector";
import { useLanguage } from "../../Context/LanguageContext";
const apiUrl = import.meta.env.VITE_API_URL;
const GuestNavBar = ({ user, types }) => {
    const onlyAdmins = false;
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    const { token, setToken, startDay, setStartDay } = useContext(AppContext);
    const [displayAuth, setDisplayAuth] = useState(0);
    const { setUser } = useContext(AppContext);

    const { language } = useLanguage();


    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    async function getdisplayAuth() {
        const res = await fetch(`${apiUrl}/api/getdisplayAuth`);
        const data = await res.json();
        setDisplayAuth(data);
    }
    async function handlelogout(e) {
        e.preventDefault();

        const res = await fetch(`${apiUrl}/api/logout`, {
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate("/");
        }
    }
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); // Toggle dropdown visibility
    };
    useEffect(() => {
        getdisplayAuth();
    }, [])
    return (
        <header className=''>
            <nav className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto py-2 '>
                {/* <Link to="/">
                    <img src="/tagemi_logo.png" className="w-[12rem] h-auto" alt="" />
                </Link> */}


                <button
                    onClick={toggleNav}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg custom:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isNavOpen}
                >
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

                <div
                    className={`w-full custom:block mx-auto custom:w-auto ${isNavOpen ? 'block' : 'hidden'}`}
                    id="navbar-default"
                >
                    <ul className='font-medium flex flex-col p-4 custom:p-0 mt-4 border border-gray-100 rounded-lg custom:flex-row custom:space-x-4 rtl:space-x-reverse custom:mt-0 custom:border-0 custom:bg-white'>
                        {onlyAdmins ? (
                            <>
                                <li>
                                    <Link to="/" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi"

                                    >
                                        {language === 'en' ? 'Home' : 'الصفحة الرئيسية'}


                                    </Link>
                                </li>
                                <li className="relative group">
                                    {/* Button to toggle dropdown */}
                                    <button
                                        onClick={toggleDropdown}
                                        className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi"
                                    >
                                        {language === 'en' ? 'Foundation Activities' : 'أنشطة المؤسسة'}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div
                                        className={`absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-100 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        <ul>
                                            {types.map((type) => (
                                                <li key={type.id}>
                                                    <Link
                                                        to={`/activities/showByActivitiesType/${type.id}`}
                                                        className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                                                        onClick={() => setIsOpen(false)} // Close dropdown on link click
                                                    >
                                                        {language === 'en' ? type.name_en : type.name_ar}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/futureProjects" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">
                                        {language === 'en' ? 'Futur Projects' : ' مشاريع مستقبلية'}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/volunteer" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">

                                        {language === 'en' ? 'Voulenteer With Us' : 'تطوع معنا'}

                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">
                                        {language === 'en' ? 'About' : 'من نحن'}

                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">
                                        {language === 'en' ? 'Contact Us' : 'تواصل معنا '}

                                    </Link>
                                </li>
                            </>
                        ) : ''
                        }

                        {user ? (
                            <>
                                <li><button className="max-w-32 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" onClick={handlelogout}>
                                    {language === 'en' ? ' Log Out' : ' خروج '}

                                </button></li>
                                <li>
                                <Link to="/GeneralWaitingList"  className="max-w-48 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" >قائمة الإنتظار الكبيرة</Link>

                                </li>
                                
                            </>
                        ) : displayAuth ? (
                            <>
                                <li><Link to="/login" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">     {language === 'en' ? ' Log In ' : ' دخول '}
                                </Link></li>
                                <li><Link to="/register" className="block py-2 px-0 text-gray-900 rounded hover:bg-gray-100 custom:hover:bg-transparent custom:border-0 custom:hover:text-blue-700 custom:p-0 font-droid-arabic-kufi">  {language === 'en' ? ' Register ' : ' تسجيل'} </Link></li>
                            </>
                        ) : ''}
                        
                        {user && (
                            <li>
                                <Link to="/appointment" className="max-w-32 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">{language === 'en' ? 'Make An Appointment' : 'إحجز موعدا'} </Link>
                            </li>
                        )}

                        {user && user.role_id == 1 && (
                            <li>
                                <Link to="/settings" className="max-w-44 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">{language === 'en' ? 'Admin Panel' : 'لوحة التحكم'}</Link>
                            </li>
                        )}

                        {user && user.role_id == 3 && (
                            <li>
                                <Link to="/AllAppointments" className="max-w-44 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300"> جميع المواعيد</Link>
                            </li>
                        )}
                        {user && user.role_id == 4 && (
                            <li>
                                <Link to={`WaitingList/${user.specialty_id}`} className="max-w-48 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300i"> قائمة إنتظار التخصص</Link>
                            </li>
                        )}

                        {user && user.role_id == 5 && (
                            <li>
                                <Link to="/AllAppointments" className="max-w-42 block px-4 py-2 font-medium font-droid-arabic-kufi mx-4 mt-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">جميع المواعيد </Link>
                            </li>
                        )}
                        {onlyAdmins ? (
                            <li>
                                <LanguageSelector />

                            </li>

                        ) : ''}

                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default GuestNavBar;
