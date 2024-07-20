import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../../Context/AppContext";
import { useParams } from 'react-router-dom';

const CheckPaitent = () => {
    const { specialityId } = useParams();
    const [appointments, setAppointmentIds] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const { token } = useContext(AppContext);

    async function GetWaitingListBySpeciality(specialityId) {
        const res = await fetch(`/api/waitinglist/GetWaitingListBySpeciality/${specialityId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log(data);
        setAppointmentIds(data['appointments']);
    }

    useEffect(() => {
        GetWaitingListBySpeciality(specialityId);
    }, [specialityId]);

    // Toggle the expanded state of a row
    const toggleRow = (patientId) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [patientId]: !prevState[patientId],
        }));
    };

    // Function to filter waiting lists based on search term
    const filteredAppointments = appointments.filter(
        (appointment) => appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };


    async function handleAbsent(e,AppointmentId){
        e.preventDefault();
        const res = await fetch(`/api/waitinglist/Absent/${AppointmentId}`,{
method : 'post',
headers:{
    Authorization : `Bearer ${token}`
}
        })

        const data = await res.json();
        console.log(data);
        GetWaitingListBySpeciality(specialityId);

    }
    async function handleComplete(e,AppointmentId){
        e.preventDefault();
        const res = await fetch(`/api/waitinglist/Complete/${AppointmentId}`,{
method : 'post',
headers:{
    Authorization : `Bearer ${token}`
}
        })

        const data = await res.json();
        console.log(data);
        GetWaitingListBySpeciality(specialityId);

    }
    
    return (
        <div >

            <input
                type="text"
                placeholder="Search by Patient Name..."
                value={searchTerm}
                onChange={handleChange}
                className="search-bar my-4"
            />
            <table className="table-auto my-7 text-center">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointments.map((appointment) => (
                        <React.Fragment key={appointment.id}>
                            <tr onClick={() => toggleRow(appointment.id)} className='border-t-4'>
                                <td>
                                {appointment.patient_id}

                                    
                                </td>
                                <td>
                                {appointment.position == 0 ? (<span className='text-red-500'>{appointment.name}</span>): appointment.name}

                                </td>
                                <td>
                                    {appointment.position == 0 ? (<span className='text-red-500'>Special Case</span>): appointment.position}
                                </td>
                                <td>
                                    <button
                                        onClick={(e) => handleAbsent(e, appointment.id)}
                                        type="button"
                                        className="text-red-700 mx-3 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                    >
                                        Absent
                                    </button>
                                    <button
                                        onClick={(e) => handleComplete(e, appointment.id)}
                                        type="button"
                                        className="text-green-700 mx-3 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                                    >
                                        Complete
                                    </button>
                                </td>
                            </tr>
                            
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CheckPaitent;