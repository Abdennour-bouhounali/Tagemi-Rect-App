import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../Context/AppContext';
const apiUrl = import.meta.env.VITE_API_URL;

const UserTable = ({ users, specialities, roles }) => {
  const { token } = useContext(AppContext);

  const { admins, setAdmins } = useState({});
  async function handleAssignRole(e, userId) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const roleId = formData.get('role');

    const res = await fetch(`${apiUrl}/api/role/ChangeRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        role: roleId,
      }),
    });

    const data = await res.json();

    // console.log(data);
  }

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Assign Role</th>
        </tr>
      </thead>
      <tbody>
        {users
          .filter(user => user.role_id !== 1)
          .map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <form onSubmit={(e) => handleAssignRole(e, user.id)} className="flex max-w-sm mx-auto">
                  <select name="role"
                    className="block appearance-none w-44 bg-[#EEEDEB] font-droid-arabic-kufi border border-[#2F3645] hover:border-[#131842] px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  >                    {roles
                    .filter(role => role.name !== 'SuperAdmin')
                    .map((role) => (
                      <option key={role.id} value={role.id} className='font-droid-arabic-kufi'>
                        {/* {role.name} */}
                        {/* {role.name === 'SuperAdmin' ? '' : ''} */}
                        {role.name === 'SimpleUser' ? 'مستعمل عادي' : ''}
                        {role.name === 'SpecialAdmin' ? 'مسؤول الحالات الخاصة' : ''}
                        {role.name === 'CheckAdmin' ? 'مسؤول التخصص' : ''}
                        {role.name === 'RecipientAdmin' ? 'مسؤول الإستقبال' : ''}

                        {role.name === 'Doctor' ? 'طبيب' : ''}

                      </option>
                    ))}
                  </select>
                  <button type="submit" className="text-blue-700 ml-4 mt-2 mr-4 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Assign</button>
                </form>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default UserTable;
