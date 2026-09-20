import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminDashboard = () => {
  const topMetrics = [
    { title: 'New Bookings', value: '604', change: '0.70%', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { title: 'Check In', value: '405', change: '0.70%', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' },
    { title: 'Check Out', value: '333', change: '0.70%', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
    { title: 'Total Revenue', value: '₦13,400,000', change: '0.70%', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' }
  ];

  const recentBookings = [
    { id: 'GA-334587', name: 'Sola Samson', room: 'Standard', roomNum: 'Room-333', duration: '6 Nights', dates: 'May, 10th 2025–May, 16th 2025', status: 'Checked In', statusBg: 'bg-emerald-50 text-emerald-600' },
    { id: 'GA-334587', name: 'Sola Samson', room: 'Standard', roomNum: 'Room-333', duration: '6 Nights', dates: 'May, 10th 2025–May, 16th 2025', status: 'Checked In', statusBg: 'bg-emerald-50 text-emerald-600' },
    { id: 'GA-334587', name: 'Sola Samson', room: 'Standard', roomNum: 'Room-333', duration: '6 Nights', dates: 'May, 10th 2025–May, 16th 2025', status: 'Checked Out', statusBg: 'bg-rose-50 text-rose-600' },
    { id: 'GA-334587', name: 'Sola Samson', room: 'Standard', roomNum: 'Room-333', duration: '6 Nights', dates: 'May, 10th 2025–May, 16th 2025', status: 'Pending', statusBg: 'bg-amber-50 text-amber-600' }
  ];

  return (
    <div className="font-['Mona_Sans',sans-serif] space-y-6">
      <AdminHeader title="Dashboard" />

      {/* 1. Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {topMetrics.map((metric) => (
          <div key={metric.title} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-3">
              <span className="text-xs font-medium text-gray-500">{metric.title}</span>
              <div className="p-2 bg-gray-50 rounded-xl text-gray-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={metric.icon} />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">{metric.value}</p>
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                <span>↗ {metric.change}</span>
                <span className="text-gray-400 font-normal">From Last Week</span>
              </p>
            </div>
          </div>
        ))}

        {/* Rating Breakdown Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Overall Rating</span>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">4.5★</span>
          </div>
          <div className="space-y-1.5 text-[10px] text-gray-500">
            {[
              { label: 'Facilities', val: 4.1 },
              { label: 'Services', val: 4.9 },
              { label: 'Comfort', val: 4.5 },
              { label: 'Location', val: 4.3 }
            ].map((rating) => (
              <div key={rating.label} className="flex items-center gap-2">
                <span className="w-12 text-gray-400">{rating.label}</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#8C6D46] h-full rounded-full" style={{ width: `${(rating.val / 5) * 100}%` }}></div>
                </div>
                <span className="font-semibold text-gray-700">{rating.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Row Charts & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reservation Monthly Bar Graph Mockup */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Reservation <span className="block text-xs font-normal text-gray-400">By months</span></h2>
          <div className="space-y-2 pt-2">
            {[
              { month: 'January', count: 186, width: '60%' },
              { month: 'February', count: 305, width: '95%' },
              { month: 'March', count: 237, width: '75%' },
              { month: 'April', count: 73, width: '25%' },
              { month: 'May', count: 209, width: '65%' },
              { month: 'June', count: 214, width: '68%' }
            ].map((bar) => (
              <div key={bar.month} className="flex items-center text-xs">
                <span className="w-16 text-gray-400 text-[11px]">{bar.month}</span>
                <div className="flex-1 bg-gray-50 rounded-lg h-5 overflow-hidden relative">
                  <div className="bg-[#EBE7DF] h-full rounded-lg" style={{ width: bar.width }}></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-600">{bar.count}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-50">
            Trending up by 5.2% this month ↗ <span className="block text-gray-400 font-normal">Showing total visitors for the last 6 months</span>
          </p>
        </div>

        {/* Booking Platform Donut Visual */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-semibold text-gray-900 text-center">Booking <span className="block text-xs font-normal text-gray-400">By Platform</span></h2>
          <div className="flex items-center justify-center my-4">
            <div className="w-36 h-36 rounded-full border-8 border-[#8C6D46] border-t-[#4A3E2C] border-r-[#C5B49D] border-b-[#EBE7DF] flex items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-700">Platforms</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4A3E2C]"></span> Direct Booking</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8C6D46]"></span> Booking.com</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C5B49D]"></span> Airbnb</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EBE7DF]"></span> Agoda</span>
          </div>
        </div>

        {/* Room Availability Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Room Availability <span className="block text-xs font-normal text-gray-400">Recent</span></h2>
            {/* Visual Bar */}
            <div className="flex gap-1 h-12 my-4 rounded-xl overflow-hidden p-1 bg-gray-50">
              <div className="bg-[#4A3E2C] h-full rounded-lg flex-1"></div>
              <div className="bg-[#8C6D46] h-full rounded-lg w-12"></div>
              <div className="bg-[#C5B49D] h-full rounded-lg w-16"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border-l-2 border-[#4A3E2C] pl-3">
              <p className="text-[11px] text-gray-400 font-medium">Occupied</p>
              <p className="text-xl font-bold text-gray-900">350</p>
            </div>
            <div className="border-l-2 border-[#8C6D46] pl-3">
              <p className="text-[11px] text-gray-400 font-medium">Available</p>
              <p className="text-xl font-bold text-gray-900">14</p>
            </div>
            <div className="border-l-2 border-[#C5B49D] pl-3">
              <p className="text-[11px] text-gray-400 font-medium">Reserved</p>
              <p className="text-xl font-bold text-gray-900">80</p>
            </div>
            <div className="border-l-2 border-gray-300 pl-3">
              <p className="text-[11px] text-gray-400 font-medium">Maintenance</p>
              <p className="text-xl font-bold text-gray-900">55</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Booking Table & Task Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking List Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Booking List</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              />
              <button className="bg-[#8C6D46] text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                All Status ▾
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 pb-2">
                  <th className="py-2 font-medium">Booking ID</th>
                  <th className="py-2 font-medium">Guest Name</th>
                  <th className="py-2 font-medium">Room Type</th>
                  <th className="py-2 font-medium">Room Number</th>
                  <th className="py-2 font-medium">Duration</th>
                  <th className="py-2 font-medium">Check-In & Check-Out</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="py-3 font-semibold text-gray-900">{b.id}</td>
                    <td className="py-3">{b.name}</td>
                    <td className="py-3">{b.room}</td>
                    <td className="py-3">{b.roomNum}</td>
                    <td className="py-3">{b.duration}</td>
                    <td className="py-3 text-gray-500">{b.dates}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${b.statusBg}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Tasks Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Task</h2>
              <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50">+</button>
            </div>

            <div className="space-y-4">
              {[1, 2].map((_, idx) => (
                <div key={idx} className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-100/80 space-y-2">
                  <p className="text-xs font-semibold text-gray-800">May 20th 2025</p>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam au turpis molestie, dictum est a, mollis tellus... <span className="text-[#8C6D46] font-medium cursor-pointer">Read More</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;