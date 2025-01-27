import React, { useContext, useEffect, useState } from 'react';
// import { saveAs } from 'file-saver';
// import { pdf } from '@react-pdf/renderer';



import { AppContext } from "../../../Context/AppContext";
const apiUrl = import.meta.env.VITE_API_URL;
import Card from './card';
import './card.css'
// import { generatePDF } from '../../../pdf';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fontkit from 'fontkit';
import { saveAs } from 'file-saver'; // To save the modified PDF

// import DownloadButton from './DownloadButton';
const CheckPresence = () => {


    const [appointments, setAppointments] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pdfTemplate, setPdfTemplate] = useState(null);
    const [customFont, setCustomFont] = useState(null);
    const [customFontBold, setCustomFontBold] = useState(null);

    const { user } = useContext(AppContext);
    const [FormData, setFormData] = useState({
        'status': ''
    });
    useEffect(() => {
        const loadAssets = async () => {
            try {
                // Load the PDF template
                const pdfUrl = '/formulaire_vide.pdf';
                const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(pdfBytes);
                pdfDoc.registerFontkit(fontkit);

                // Load the regular font
                const fontUrl = '/simpo.ttf';
                const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
                const regularFont = await pdfDoc.embedFont(fontBytes);

                // Load the bold font
                const fontUrlBold = '/simpoBold.ttf';
                const fontBytesBold = await fetch(fontUrlBold).then(res => res.arrayBuffer());
                const boldFont = await pdfDoc.embedFont(fontBytesBold);

                // Save the loaded assets in state
                setPdfTemplate(pdfDoc);
                setCustomFont(regularFont);
                setCustomFontBold(boldFont);
            } catch (error) {
                console.error('Error loading PDF or fonts:', error);
            }
        };

        loadAssets();
    }, []);
    const { token, startDay, setStartDay } = useContext(AppContext);
    async function getAppoitments() {
        const res = await fetch(`${apiUrl}/api/appointment`, {
            headers: {

                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json();

        setAppointments(data['appoitments']);
        console.log(data);
        console.log("Hi")

    }
    async function getstartDay() {
        const res = await fetch(`${apiUrl}/api/getstartDay`);
        const data = await res.json();
        setStartDay(data);
    }



    useEffect(() => {
        getAppoitments();
    }, []);

    // Toggle the expanded state of a row
    const toggleRow = (patientId) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [patientId]: !prevState[patientId],
        }));
    };


    async function hanlePresence(e, patientId) {
        e.preventDefault();
        const res = await fetch(`${apiUrl}/api/appointment/ConfirmPresence/${patientId}`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        getAppoitments();
    }

    async function hanleOnDelay(e, patientId) {
        e.preventDefault();
        const res = await fetch(`${apiUrl}/api/appointment/ConfirmPresenceDelay/${patientId}`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        getAppoitments();
    }
    // Function to filter appointments based on search term
    const filteredAppointments = Object.keys(appointments).reduce(
        (filtered, patientId) => {
            const filteredPatientAppointments = appointments[patientId].filter(
                (appointment) =>
                    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredPatientAppointments.length > 0) {
                filtered[patientId] = filteredPatientAppointments;
            }

            return filtered;
        },
        {}
    );

    // Function to filter appointments based on search term
    const filteredAppointmentsByStatus = Object.keys(appointments).reduce(
        (filtered, patientId) => {
            const filteredPatientAppointmentsByStatus = appointments[patientId].filter(
                (appointment) =>
                    appointment.status.toLowerCase().includes(statusFilter.toLowerCase())
            );

            if (filteredPatientAppointmentsByStatus.length > 0) {
                filtered[patientId] = filteredPatientAppointmentsByStatus;
            }

            return filtered;
        },
        {}
    );

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    }

    useEffect(() => {
        if (startDay) {
            getstartDay();
            getAppoitments();
        }
    })
    // Determine the appointments to display based on search term
    // const displayAppointments = searchTerm === '' ? (statusFilter === "" ? appointments : filteredAppointmentsByStatus) : filteredAppointments;

    const displayAppointments = searchTerm === ''
        ? (statusFilter === "" ? appointments : filteredAppointmentsByStatus)
        : (statusFilter === ""
            ? filteredAppointments
            : Object.keys(filteredAppointmentsByStatus).reduce(
                (filtered, patientId) => {
                    const filteredPatientAppointments = filteredAppointmentsByStatus[patientId].filter(
                        (appointment) =>
                            appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredPatientAppointments.length > 0) {
                        filtered[patientId] = filteredPatientAppointments;
                    }

                    return filtered;
                },
                {}
            )
        );

    async function hanleSpecialCase(e, patientId) {
        e.preventDefault();
        const res = await fetch(`${apiUrl}/api/appointment/SpecialCase/${patientId}`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        getAppoitments();
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
            setMessage(data['message']);
        }
        setTimeout(() => {
            setMessage(null);
        }, 2000);
    }


    const printPDF = async (data) => {
        console.log(data);
        if (!pdfTemplate || !customFont || !customFontBold) {
            console.error('Assets not loaded');
            return;
        }

        // Clone the loaded PDF template
        const pdfDoc = await PDFDocument.load(await pdfTemplate.save());
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Add text to the PDF using the pre-loaded fonts
        firstPage.drawText(`${data[0].name}`, { x: 400, y: 160, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText(`${data[0].lastName}`, { x: 400, y: 130, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText(`${data[0].birthday}`, { x: 400, y: 100, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText("الفحوصات الطبية 71 جانفي 5202", { x: 360, y: 338, size: 15, font: customFontBold, color: rgb(0, 0, 0) });
        firstPage.drawText("مركب الفلك وهران", { x: 360, y: 317, size: 13, font: customFont, color: rgb(0, 0, 0) });

        firstPage.drawText(`TAJ_${data[0].patient_id}`, { x: 400, y: 190, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText(`${data[0].specialty.name}`, { x: 130, y: 348, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText(`/`, { x: 200, y: 320, size: 13, font: customFont, color: rgb(0, 0, 0) });
        firstPage.drawText(`/`, { x: 200, y: 142, size: 13, font: customFont, color: rgb(0, 0, 0) });
        if (data[1]) {
            firstPage.drawText(`${data[1].specialty.name}`, { x: 130, y: 170, size: 13, font: customFont, color: rgb(0, 0, 0) });
        }
        if (data[0].position === 0) {
            firstPage.drawText(`حالة خاصة`, { x: 400, y: 60, size: 25, font: customFontBold, color: rgb(0, 0, 0) });

        }
        // Serialize the PDF document to bytes
        const pdfBytes = await pdfDoc.save();


        // Create a Blob for the PDF
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Create an Object URL for the Blob
        const pdfUrlToPrint = URL.createObjectURL(pdfBlob);

        // Open the Object URL in a new tab for printing
        const printWindow = window.open(pdfUrlToPrint, '_blank');
        printWindow.onload = () => {
            printWindow.print();
        };
    };



    return (
        <div className='md:container md:mx-auto min-h-screen text-center'>
            <h1 className='font-droid-arabic-kufi my-4 mx-auto text-2xl font-black text-[#131842]'>جميع المواعيد</h1>
            <div className="flex">
                <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="search-bar font-droid-arabic-kufi  m-4 px-2 bg-[#EEEDEB]">
                    <option className='font-droid-arabic-kufi' value="">الكل</option>
                    <option className='font-droid-arabic-kufi' value="Pending">لم يأت بعد</option>
                    <option className='font-droid-arabic-kufi' value="Present">الحاضرون</option>
                    <option className='font-droid-arabic-kufi' value="Completed">تم فحصهم</option>
                    <option className='font-droid-arabic-kufi' value="Waiting List">في الإنتظار</option>
                </select>
                <input
                    type="text"
                    placeholder="إبحث بالإسم"
                    value={searchTerm}
                    onChange={handleChange}
                    className="search-bar my-4 font-droid-arabic-kufi"
                />
            </div>
            <table className="table-auto my-7 text-nowrap text-center font-droid-arabic-kufi">
                <thead>
                    <tr>
                        <th className='font-droid-arabic-kufi mx-4'>ID</th>
                        <th className='font-droid-arabic-kufi mx-4'>الاسم</th>
                        <th className='font-droid-arabic-kufi mx-14'>اللقب</th>
                        <th className='font-droid-arabic-kufi mx-4'>تاريخ الميلاد</th>
                        <th className='font-droid-arabic-kufi mx-4'>التخصص</th>
                        <th className='font-droid-arabic-kufi mx-4'>وقت المجيئ</th>
                        <th className='font-droid-arabic-kufi mx-4'>الحالة</th>
                        <th className='font-droid-arabic-kufi mx-4'>أمر</th>
                        <th className='font-droid-arabic-kufi mx-4'>طباعة</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(displayAppointments).map((patientId) => (
                        <React.Fragment key={patientId}>
                            <tr onClick={() => toggleRow(patientId)} className='border-t-4 text-center'>
                                <td>TJM_{patientId}</td>
                                <td>
                                    {displayAppointments[patientId][0].position == 0 ? (<span className='text-red-500 font-droid-arabic-kufi'>{displayAppointments[patientId][0].name}</span>) : displayAppointments[patientId][0].name}
                                </td>
                                <td>
                                    {displayAppointments[patientId][0].position == 0 ? (<span className='text-red-500 font-droid-arabic-kufi'>{displayAppointments[patientId][0].name}</span>) : displayAppointments[patientId][0].lastName}
                                </td>
                                <td>
                                    {displayAppointments[patientId][0].position == 0 ? (<span className='text-red-500 font-droid-arabic-kufi'>{displayAppointments[patientId][0].name}</span>) : displayAppointments[patientId][0].birthday}
                                </td>
                                <td>{displayAppointments[patientId][0].specialty.name}</td>

                                <td>
                                    {displayAppointments[patientId][0].position == 0 ? (<span className='text-red-500 font-droid-arabic-kufi'>يجتاز متى ما جاء</span>) : displayAppointments[patientId][0].time}

                                </td>
                                <td className='text-center'>
                                    <span className={displayAppointments[patientId][0].status === 'Present' ? 'text-green-800' : displayAppointments[patientId][0].status === 'Completed' ? 'text-yellow-400' : 'text-yellow-800'}>
                                        {displayAppointments[patientId][0].status}
                                    </span>
                                </td>
                                <td className=' text-center mx-auto'>
                                    {displayAppointments[patientId][0].status == 'Pending' ? (
                                        <div className='flex justify-center'>
                                            {(user.role_id == 1 || user.role_id == 5 || user.role_id == 3) && (
                                                <>
                                                    <form className='text-center max-w-fit' onSubmit={(e) => hanlePresence(e, patientId)}>
                                                        <input
                                                            value="Present"
                                                            type="hidden" name="status" />
                                                        <button
                                                            type="submit"
                                                            className="text-green-700 hover:text-white border font-droid-arabic-kufi border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                                            disabled={displayAppointments[patientId][0].status !== 'Pending'}

                                                        >
                                                            حاضر
                                                        </button>

                                                    </form>

                                                    <form className='ml-4 text-center  max-w-fit' onSubmit={(e) => hanleOnDelay(e, patientId)}>
                                                        <input
                                                            value="Present"
                                                            type="hidden" name="status" />
                                                        <button
                                                            type="submit"
                                                            disabled={displayAppointments[patientId][0].status !== 'Pending'}
                                                            className="text-yellow-700 font-droid-arabic-kufi hover:text-white border border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                                        >
                                                            جاء متأخرا
                                                        </button>

                                                    </form>
                                                </>
                                            )}
                                            {(user.role_id == 1 || user.role_id == 3) && (
                                                <form className='ml-4 ' onSubmit={(e) => hanleSpecialCase(e, patientId)}>
                                                    <input
                                                        value="Present"
                                                        type="hidden" name="status" />

                                                    <button
                                                        type='submit'
                                                        className="text-yellow-500 font-droid-arabic-kufi hover:text-white border border-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                                    >حالة خاصة </button>
                                                </form>
                                            )}
                                        </div>
                                    ) : displayAppointments[patientId][0].status == 'Waiting List' && user.role_id == 1 ?
                                        <div className='flex justify-center'>
                                            <form className='text-center max-w-fit' onSubmit={(e) => hanlePresence(e, patientId)}>
                                                <input
                                                    value="Present"
                                                    type="hidden" name="status" />
                                                <button
                                                    type="submit"
                                                    className="text-green-700  hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                                    disabled={displayAppointments[patientId][0].status !== 'Pending'}

                                                >
                                                    يضاف لقائمة الاحتياط
                                                </button>

                                            </form></div> :
                                        <h2 className='text-center '>لا يوجد خيارات</h2>
                                    }

                                </td>
                                <td className='text-center mx-auto'>
                                    {/* <Card data={displayAppointments[patientId]} /> */}
                                    {/* <DownloadButton CardComponent={<Card data={displayAppointments[patientId]} />} /> */}
                                    {/* <button className="button" onClick={() => generatePDF(`card-${patientId}`)}> */}
                                    {/* Generate Card PDF */}
                                    {/* </button> */}
                                    <button onClick={() => printPDF(displayAppointments[patientId])}>Print PDF</button>

                                </td>
                            </tr>
                            {expandedRows[patientId] &&
                                displayAppointments[patientId].slice(1).map((appointment) => (
                                    <tr key={appointment.id} className="bg-gray-100 expanded-row">
                                        <td></td>
                                        <td>{appointment.name}</td>
                                        <td>{appointment.specialty.name}</td>
                                        <td>{appointment.time}</td>
                                        <td className='text-center'>
                                            <span className={appointment.status === 'Present' ? 'text-green-800' : appointment.status === 'Completed' ? 'text-yellow-400' : 'text-yellow-800'}>
                                                {appointment.status}
                                            </span>

                                        </td>
                                        <td></td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default CheckPresence;
