import React from 'react';
import { Link } from 'react-router-dom';
import { getAllCalendars } from '../utils/calendarData';

const Home = () => {
  const calendars = getAllCalendars();
  const part1 = calendars.slice(0, 6);
  const part2 = calendars.slice(6, 12);

  const CalendarGrid = ({ items }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((calendar) => (
        <Link key={calendar.id} to={`/calendar/${calendar.id}`} className="block group">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md hover:ring-2 hover:ring-blue-400 relative">
            
            {/* Magnifying Glass Icon */}
            <div className="absolute top-2 right-2 z-20 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow-sm group-hover:bg-blue-50 transition-colors pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
               </svg>
            </div>

            <div className="aspect-[3/4] p-2 bg-gray-50 flex items-center justify-center">
              <img 
                src={calendar.front} 
                alt={`Lịch bàn ${calendar.id}`}
                className="max-h-full max-w-full object-contain drop-shadow-sm"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e0e0e0] py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Flip Calendar CTA */}
        <section>
          <Link
            to="/flip-calendar"
            className="block bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-1">Xem lịch bàn lật 3D</h2>
                <p className="text-white/80 text-sm md:text-base">Lật qua 12 trang với hiệu ứng 3D tương tác</p>
              </div>
              <span className="text-3xl md:text-4xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pl-1 border-l-4 border-blue-500">
            Phần 1: Cấu trúc của hình thái kinh tế xã hội
          </h2>
          <CalendarGrid items={part1} />
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pl-1 border-l-4 border-purple-500">
            Phần 2: Tiến trình lịch sử của các hình thái
          </h2>
          <CalendarGrid items={part2} />
        </section>
      </div>
    </div>
  );
};

export default Home;
