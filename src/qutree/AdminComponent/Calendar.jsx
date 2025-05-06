import React, { useState, useEffect } from 'react';
import api from '../api';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DayDetailsModal = ({ isOpen, onClose, date, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(data.assigned).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-amber-600">Assigned Cards</h4>
              {Object.entries(data.assigned).map(([name, count]) => (
                <div key={`modal-assigned-${name}`} className="flex justify-between items-center bg-amber-50 p-2 rounded">
                  <span>{name}</span>
                  <span className="font-medium">{count} assigned</span>
                </div>
              ))}
            </div>
          )}
          
          {Object.entries(data.returned).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Returned Cards</h4>
              {Object.entries(data.returned).map(([name, count]) => (
                <div key={`modal-returned-${name}`} className="flex justify-between items-center bg-red-50 p-2 rounded">
                  <span>{name}</span>
                  <span className="font-medium">{count} returned</span>
                </div>
              ))}
            </div>
          )}
          
          {Object.entries(data.active).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Activated Cards</h4>
              {Object.entries(data.active).map(([name, count]) => (
                <div key={`modal-active-${name}`} className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <span>{name}</span>
                  <span className="font-medium">{count} activation</span>
                </div>
              ))}
            </div>
          )}
          
          {Object.entries(data.assigned).length === 0 && 
           Object.entries(data.returned).length === 0 && 
           Object.entries(data.active).length === 0 && (
            <p className="text-gray-500 text-center py-4">No activities for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    isOpen: false,
    date: null,
    data: null
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchCalendarData = async () => {
    setLoading(true);
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    try {
      const response = await api.get(`/cards/returns/calendar-view`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setCalendarData(response.data.dateWiseProgress);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date) => {
    const formattedDate = formatDate(date);
    const dayData = calendarData[formattedDate] || {
      assigned: {},
      returned: {},
      active: {}
    };
    
    setModalData({
      isOpen: true,
      date: date,
      data: dayData
    });
  };

  const renderCellContent = (date) => {
    const formattedDate = formatDate(date);
    const dayData = calendarData[formattedDate];
    
    if (!dayData) return null;

    return (
      <div className="mt-1 text-xs overflow-y-auto max-h-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {Object.entries(dayData.assigned).map(([name, count]) => (
          <div key={`assigned-${name}`} className="text-amber-600 py-0.5">
            {name}: {count} assigned
          </div>
        ))}
        {Object.entries(dayData.returned).map(([name, count]) => (
          <div key={`returned-${name}`} className="text-red-600 py-0.5">
            {name}: {count} returned
          </div>
        ))}
        {Object.entries(dayData.active).map(([name, count]) => (
          <div key={`active-${name}`} className="text-green-600 py-0.5">
            {name}: {count} active
          </div>
        ))}
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const formattedDate = formatDate(date);
      const hasData = calendarData[formattedDate] && (
        Object.keys(calendarData[formattedDate].assigned).length > 0 ||
        Object.keys(calendarData[formattedDate].returned).length > 0 ||
        Object.keys(calendarData[formattedDate].active).length > 0
      );
      
      days.push(
        <div 
          key={day} 
          onClick={() => handleDayClick(date)}
          className={`p-2 border border-gray-200 min-h-24 max-h-32 overflow-hidden 
            ${hasData ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
        >
          <div className="font-semibold sticky top-0 bg-white z-10">{day}</div>
          {renderCellContent(date)}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-px mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-white">
            {renderCalendar()}
          </div>
        </>
      )}

      <DayDetailsModal 
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        date={modalData.date}
        data={modalData.data}
      />
    </div>
  );
};

export default Calendar;