import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api'; // Import API
import { Calendar, Clock, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Appointments = () => {
    const { token } = useAuth(); // We might not need token here if api.js handles it via localStorage
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentAPI.getAll();
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to fetch appointments');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await appointmentAPI.updateStatus(id, status);
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading appointments...</div>;
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Appointments</h1>
                    <p className="page-subtitle">Manage customer store visits</p>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    No appointments found
                                </td>
                            </tr>
                        ) : (
                            appointments.map((apt) => (
                                <tr key={apt._id}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-2 font-medium">
                                                <Calendar size={14} className="text-gray-400" />
                                                {apt.date}
                                            </span>
                                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock size={14} className="text-gray-400" />
                                                {apt.time}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium text-gray-900">{apt.customer?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm">
                                                <Phone size={14} className="text-gray-400" />
                                                {apt.customer?.phone || 'N/A'}
                                            </span>
                                            <span className="text-xs text-gray-500">{apt.customer?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-2 py-1 bg-sky-50 text-sky-700 rounded-md text-xs font-medium border border-sky-100">
                                            {apt.purpose}
                                        </span>
                                        {apt.notes && (
                                            <p className="mt-1 text-xs text-gray-500 max-w-[200px] truncate" title={apt.notes}>
                                                📝 {apt.notes}
                                            </p>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${apt.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                            apt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {apt.status !== 'Confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                                                    className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors"
                                                    title="Confirm"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {apt.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                                    className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                                                    title="Cancel"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Appointments;
