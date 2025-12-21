'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import { formatDate, formatTime } from '@/utils/formatters';

// Demo bookings data
const demoBookings = [
  {
    id: '1',
    stylistName: 'Ava Harper',
    stylistAvatar: undefined,
    date: new Date(),
    time: '10:00',
    service: 'Haircut',
    price: 30,
    status: 'upcoming' as const,
  },
  {
    id: '2',
    stylistName: 'Chloe Bennett',
    stylistAvatar: undefined,
    date: new Date(Date.now() + 86400000),
    time: '14:00',
    service: 'Manicure',
    price: 25,
    status: 'upcoming' as const,
  },
  {
    id: '3',
    stylistName: 'Isabella Carter',
    stylistAvatar: undefined,
    date: new Date(2024, 6, 20),
    time: '11:00',
    service: 'Facial',
    price: 40,
    status: 'past' as const,
  },
];

export default function BookingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, '', `/${params.salonSlug}/bookings`);
    }
  }, [searchParams, params.salonSlug]);

  const filteredBookings = demoBookings.filter(
    (booking) => booking.status === activeTab
  );

  return (
    <div className="min-h-screen bg-white">
      <Header title="My Bookings" showBack />

      <main className="px-4 lg:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-center font-medium">
                Booking confirmed successfully!
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 lg:flex-none lg:px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-[#E91E8C] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 lg:flex-none lg:px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-[#E91E8C] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
          </div>

          {/* Bookings List - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={booking.stylistAvatar}
                    alt={booking.stylistName}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.stylistName}
                    </h3>
                    <p className="text-sm text-[#8B7E8B]">
                      {formatDate(booking.date)}, {formatTime(booking.time)}
                    </p>
                    <p className="text-sm text-[#8B7E8B]">{booking.service}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>

          {/* Bookings List - Desktop: Card Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50 rounded-xl p-4 flex items-start gap-4"
              >
                <Avatar
                  src={booking.stylistAvatar}
                  alt={booking.stylistName}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {booking.stylistName}
                    </h3>
                    <span className="text-sm font-medium text-[#E91E8C]">
                      ${booking.price}
                    </span>
                  </div>
                  <p className="text-sm text-[#8B7E8B] mb-1">
                    {formatDate(booking.date)}, {formatTime(booking.time)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{booking.service}</p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {activeTab === 'upcoming'
                  ? 'No upcoming bookings'
                  : 'No past bookings'}
              </p>
              {activeTab === 'upcoming' && (
                <Button
                  variant="primary"
                  onClick={() =>
                    (window.location.href = `/${params.salonSlug}`)
                  }
                >
                  Book Now
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
