import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL; 
const SuperAdminNav = ({user,specialities,dropdownRef,toggleDropdown,isOpen}) => {
return (
    


<nav className="mt-4 space-y-2 block ">
            {/* <Link to="/specialCase" className="block font-medium px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">Special Case</Link> */}

            <Link to="/AllAppointments" className="block font-medium font-droid-arabic-kufi py-2 px-4 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">جميع المواعيد</Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className=" text-[#2F3645] font-droid-arabic-kufi font-medium py-2 px-4 rounded-full inline-flex items-center bg-[#EEEDEB] hover:bg-[#131842] hover:text-white transition duration-300"
              >
                <span className="font-droid-arabic-kufi"> لوائح الإنتظار</span>
                <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M10 12l-6-6h12z" />
                </svg>
              </button>
              {isOpen && (
                <ul className="absolute left-0 top-full w-48 bg-white shadow-md rounded py-2 z-50">

                  {specialities
                    .filter(specialitie => specialitie.id !== 6)
                    .map((speciality) => (
                      <li key={speciality.id}>
                        <Link
                          to={`/WaitingList/${speciality.id}`}
                          className="block px-4 py-2 text-[#2F3645] hover:bg-gray-100"
                        >
                          {speciality.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <Link to="/settings" className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">إعدادات عامة</Link>
            <Link to="/users" className="block px-4 font-medium font-droid-arabic-kufi  py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300"> تسيير الأعضاء</Link>
            <Link to="/speciality" className="block font-medium font-droid-arabic-kufi  px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">تسيير التخصصات </Link>
            <Link to="/Statitistics" className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">إحصائيت</Link>
            <Link to="/rules" className="block font-medium px-4 font-droid-arabic-kufi  py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">التحكم في الضوابط </Link>
            <div className="relative group">
                  <button className="block font-medium px-4 font-droid-arabic-kufi  py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300">
                       التحكم في محتوى الموقع
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ul>
                      <li><Link className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" to="/types">مجالات الأنشطة</Link></li>
                        <li><Link className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" to="/activities">الأنشطة</Link></li>
                        <li><Link className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" to="/sponsors">الداعمون</Link></li>
                        <li><Link className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" to="/future-projects">مشاريع مستقبلية</Link></li>
                        <li><Link className="block font-medium font-droid-arabic-kufi px-4 py-2 text-[#2F3645] hover:bg-[#131842] hover:text-white  rounded-full transition duration-300" to="/blogs">مقالات</Link></li>

                      </ul>
                  </div>
            </div>


          </nav>
    
    
    );
};

export default SuperAdminNav;
