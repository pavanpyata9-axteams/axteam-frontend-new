import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { reviewService } from '../../services/reviewService';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';

const MobileAdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [images, setImages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newImage, setNewImage] = useState({ title: '', file: null, category: '', section: 'Appliance Services' });

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (userType === 'admin' && userName) {
      setIsAuthenticated(true);
      loadAllData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadAllData = async () => {
    await Promise.all([
      loadImages(),
      loadBookings(),
      loadSupportRequests(),
      loadUsers(),
      loadReviews()
    ]);
  };

  const loadImages = async () => {
    try {
      console.log('🔍 [MobileAdminDashboard] Loading gallery from backend...');
      const response = await api.get('/gallery');
      
      console.log('🖼️ [MobileAdminDashboard] Gallery response:', response.data);
      
      const galleryItems = response.data.data;
      setImages(galleryItems);
      console.log('✅ [MobileAdminDashboard] Loaded gallery images:', galleryItems.length);
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error loading gallery:', error);
      setImages([]);
    }
  };

  const loadBookings = async () => {
    try {
      console.log('🔍 [MobileAdminDashboard] Loading all bookings from backend...');
      
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [MobileAdminDashboard] No auth token for bookings');
        return;
      }

      const response = await bookingService.getAllBookings();
      
      if (response.success && response.data && response.data.bookings) {
        const bookings = response.data.data?.bookings || response.data.bookings || [];
        setBookings(Array.isArray(bookings) ? bookings : []);
        console.log('✅ [MobileAdminDashboard] Loaded bookings:', bookings.length);
      } else {
        console.error('❌ [MobileAdminDashboard] Failed to load bookings:', response);
        setBookings([]);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error loading bookings:', error);
    }
  };

  const loadSupportRequests = () => {
    const savedSupport = JSON.parse(localStorage.getItem('supportRequests') || '[]');
    setSupportRequests(savedSupport);
  };

  const loadReviews = async () => {
    try {
      console.log('🔍 [MobileAdminDashboard] Loading all reviews from backend...');
      
      const response = await reviewService.getAllReviews();
      
      console.log('⭐ [MobileAdminDashboard] Reviews response:', response);
      
      if (!response.data.data) {
        console.error("Invalid review response:", response.data);
        return;
      }

      const reviews = response.data.data;
      setReviews(reviews);
      console.log('✅ [MobileAdminDashboard] Loaded reviews:', reviews.length);
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error loading reviews:', error);
      setReviews([]);
    }
  };

  const loadUsers = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [MobileAdminDashboard] No auth token for users');
        return;
      }

      console.log('🔍 [MobileAdminDashboard] Loading all users from backend...');
      
      const response = await api.get('/admin/users');

      const data = response.data;
      console.log('👥 [MobileAdminDashboard] Users response:', data);
      
      if (data.success && data.data && data.data.users) {
        setUsers(data.data.users);
        console.log('✅ [MobileAdminDashboard] Loaded users:', data.data.users.length);
      } else {
        console.error('❌ [MobileAdminDashboard] Failed to load users:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error loading users:', error);
      setUsers([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setNewImage({ ...newImage, file });
    } else {
      alert('Please select an image or video file');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (newImage.title && newImage.file && newImage.category) {
      try {
        const formData = new FormData();
        formData.append('file', newImage.file);
        formData.append('title', newImage.title);
        formData.append('category', newImage.category);
        formData.append('section', newImage.section);

        const response = await api.post("/gallery/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          loadImages();
          setNewImage({ title: '', file: null, category: '', section: 'Appliance Services' });
          setShowUpload(false);
          alert('Media uploaded successfully!');
        } else {
          alert('Upload failed: ' + response.data.message);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading media: ' + error.message);
      }
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Delete this image?')) {
      try {
        console.log('🗑️ [MobileAdminDashboard] Deleting image:', id);
        const response = await api.delete(`/gallery/${id}`);
        
        if (response.data.success) {
          console.log('✅ [MobileAdminDashboard] Image deleted successfully');
          await loadImages(); // Refresh gallery
          alert('Image deleted successfully!');
        } else {
          alert('Failed to delete image: ' + response.data.message);
        }
      } catch (error) {
        console.error('❌ [MobileAdminDashboard] Error deleting image:', error);
        alert('Error deleting image. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Validate inputs
    if (!id) {
      console.error('❌ [MobileAdminDashboard] No booking ID provided');
      alert('Error: No booking ID found. Please refresh the page and try again.');
      return;
    }

    if (!newStatus || newStatus === '') {
      console.error('❌ [MobileAdminDashboard] No status provided');
      alert('Error: No status selected.');
      return;
    }

    // Validate status value
    const validStatuses = ['Pending', 'Confirmed', 'Completed'];
    if (!validStatuses.includes(newStatus)) {
      console.error('❌ [MobileAdminDashboard] Invalid status provided:', newStatus);
      alert(`Error: Invalid status "${newStatus}". Valid statuses are: ${validStatuses.join(', ')}`);
      return;
    }

    try {
      console.log('🔄 [MobileAdminDashboard] Updating booking status:', { id, newStatus });
      
      const response = await bookingService.updateBookingStatus(id, newStatus);
      
      if (response.success) {
        console.log('✅ [MobileAdminDashboard] Status updated successfully');
        await loadBookings(); // Refresh from backend
        setSelectedBooking(null);
        alert(`Booking status updated to ${newStatus}. Customer has been notified.`);
      } else {
        console.error('❌ [MobileAdminDashboard] Failed to update status:', response);
        alert('Failed to update booking status. Please try again.');
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error updating status:', error);
      console.error('❌ [MobileAdminDashboard] Error details:', error.message);
      alert(`Error updating booking status: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ [MobileAdminDashboard] Deleting booking:', id);
      
      const response = await bookingService.deleteBooking(id);
      
      if (response.success) {
        console.log('✅ [MobileAdminDashboard] Booking deleted successfully');
        await loadBookings(); // Refresh from backend
        setSelectedBooking(null);
        alert('Booking deleted successfully.');
      } else {
        console.error('❌ [MobileAdminDashboard] Failed to delete booking:', response);
        alert('Failed to delete booking. Please try again.');
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error deleting booking:', error);
      alert('Error deleting booking. Please try again.');
    }
  };

  const handleAssignTechnician = async (id) => {
    const booking = bookings.find(b => (b._id || b.id) === id);
    if (!booking) {
      alert('Booking not found');
      return;
    }

    const customerName = booking.name;
    
    const technicianName = prompt(
      `🔧 Assign Technician\n\nCustomer: ${customerName}\nService: ${booking.servicesText || 'Service Booking'}\n\nEnter technician name:`, 
      booking.technician?.name || ''
    );
    
    if (technicianName === null || technicianName.trim() === '') {
      if (technicianName === '') alert('Please enter a technician name.');
      return;
    }
    
    const technicianPhone = prompt(
      `📞 Technician Contact\n\nTechnician: ${technicianName}\nCustomer: ${customerName}\n\nEnter technician phone number:`, 
      booking.technician?.phone || ''
    );
    
    if (technicianPhone === null || technicianPhone.trim() === '') {
      if (technicianPhone === '') alert('Please enter a phone number.');
      return;
    }

    const technicianEmail = prompt(
      `📧 Technician Email (Optional)\n\nTechnician: ${technicianName}\nPhone: ${technicianPhone}\n\nEnter technician email (optional):`,
      booking.technician?.email || ''
    );

    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      console.log('🔧 Assigning technician via API...', { bookingId: booking._id, technicianName, technicianPhone });

      const response = await api.post(`/admin/bookings/${booking._id}/assign-technician`, {
        technicianName: technicianName.trim(),
        technicianPhone: technicianPhone.trim(),
        technicianEmail: technicianEmail?.trim() || null
      });

      const data = response.data;

      if (data.success) {
        // Reload bookings to get updated data
        await loadBookings();
        setSelectedBooking(null);
        
        alert(`✅ Technician Assigned Successfully!\n\nTechnician: ${technicianName}\nPhone: ${technicianPhone}\nCustomer: ${customerName}\n\n📱 Notifications sent to customer and technician.`);
      } else {
        console.error('❌ Failed to assign technician:', data);
        alert(`Failed to assign technician: ${data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('❌ Technician assignment error:', error);
      alert('Failed to assign technician. Please check your connection and try again.');
    }
  };

  const handleSupportStatusChange = (id, newStatus) => {
    const updatedSupport = supportRequests.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    );
    localStorage.setItem('supportRequests', JSON.stringify(updatedSupport));
    loadSupportRequests();
  };

  const handleReplyToReview = async (reviewId, currentReply) => {
    const reply = prompt('Reply to this review:', currentReply || '');
    if (reply !== null && reply.trim() !== '') {
      try {
        console.log('💬 [MobileAdminDashboard] Replying to review:', reviewId);
        
        const response = await reviewService.replyToReview(reviewId, reply.trim());
        
        if (response.success) {
          await loadReviews(); // Refresh reviews
          alert('Reply posted successfully!');
          console.log('✅ [MobileAdminDashboard] Reply posted successfully');
        } else {
          alert('Failed to post reply: ' + response.message);
        }
      } catch (error) {
        console.error('❌ [MobileAdminDashboard] Error posting reply:', error);
        alert('Error posting reply. Please try again.');
      }
    }
  };

  const handleToggleReviewApproval = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      console.log('👍 [MobileAdminDashboard] Toggling review approval:', reviewId, newStatus);
      
      const response = await reviewService.updateReviewApproval(reviewId, { status: newStatus });
      
      if (response.success) {
        await loadReviews(); // Refresh reviews
        alert(`Review ${newStatus === 'approved' ? 'approved' : 'marked as pending'}!`);
        console.log('✅ [MobileAdminDashboard] Review status updated');
      } else {
        alert('Failed to update review status: ' + response.message);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error updating review status:', error);
      alert('Error updating review status. Please try again.');
    }
  };

  const handleToggleReviewVisibility = async (reviewId, currentVisibility) => {
    try {
      console.log('👁️ [MobileAdminDashboard] Toggling review visibility:', reviewId);
      
      const response = await reviewService.toggleReviewVisibility(reviewId);
      
      if (response.success) {
        await loadReviews(); // Refresh reviews
        alert(`Review ${currentVisibility ? 'hidden from' : 'shown on'} homepage!`);
        console.log('✅ [MobileAdminDashboard] Review visibility toggled');
      } else {
        alert('Failed to toggle visibility: ' + response.message);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error toggling visibility:', error);
      alert('Error toggling visibility. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId, userName) => {
    const confirmDelete = window.confirm(
      `⚠️ DELETE REVIEW?\n\n` +
      `User: ${userName}\n\n` +
      `This will permanently delete this review.\n` +
      `Are you sure?`
    );
    
    if (!confirmDelete) return;
    
    try {
      console.log('🗑️ [MobileAdminDashboard] Deleting review:', reviewId);
      
      const response = await reviewService.deleteReview(reviewId);
      
      if (response.success) {
        await loadReviews(); // Refresh reviews
        alert('Review deleted successfully!');
        console.log('✅ [MobileAdminDashboard] Review deleted');
      } else {
        alert('Failed to delete review: ' + response.message);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error deleting review:', error);
      alert('Error deleting review. Please try again.');
    }
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    const confirmDelete = window.confirm(
      `⚠️ DELETE USER PERMANENTLY?\n\n` +
      `User: ${userName}\n` +
      `Email: ${userEmail}\n\n` +
      `This will:\n` +
      `• Delete the user account from database\n` +
      `• Delete ALL their bookings\n` +
      `• User will NOT be able to login again\n\n` +
      `Are you absolutely sure?`
    );
    
    if (!confirmDelete) return;
    
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }
      
      console.log('🗑️ [MobileAdminDashboard] Deleting user:', userId);
      
      const response = await api.delete(`/admin/users/${userId}`);
      
      const data = response.data;
      
      if (data.success) {
        alert(`✅ User Deleted Successfully!\n\n` +
              `• User: ${data.data.deletedUser}\n` +
              `• Deleted ${data.data.deletedBookings} booking(s)\n` +
              `• User can no longer login`);
        
        // Refresh users list
        await loadUsers();
        await loadBookings(); // Also refresh bookings if needed
        
        console.log('✅ [MobileAdminDashboard] User deleted and data refreshed');
      } else {
        alert(`❌ Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ [MobileAdminDashboard] Error deleting user:', error);
      alert('❌ Error deleting user. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats = {
    totalUsers: users.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'Pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'Completed').length,
    supportRequests: supportRequests.length,
    openSupport: supportRequests.filter(s => s.status === 'Open').length,
    galleryImages: images.length,
    totalReviews: reviews.length,
    approvedReviews: reviews.filter(r => r.status === 'approved').length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
    visibleReviews: reviews.filter(r => r.isVisible).length,
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'support', label: 'Support', icon: '🎧' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'users', label: 'Users', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-bold text-red-600">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {showMenu ? '✕' : '☰'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="bg-white border-t">
            <div className="grid grid-cols-3 gap-1 p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMenu(false);
                  }}
                  className={`p-3 rounded-lg text-center ${
                    activeTab === item.id
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="p-4 pb-20">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.supportRequests}</div>
                <div className="text-sm text-gray-600">Support Requests</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.galleryImages}</div>
                <div className="text-sm text-gray-600">Gallery Images</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.totalReviews}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.approvedReviews}</div>
                <div className="text-sm text-gray-600">Approved Reviews</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.visibleReviews}</div>
                <div className="text-sm text-gray-600">Visible on Homepage</div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Bookings</h2>
              <button
                onClick={loadBookings}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                🔄 Refresh
              </button>
            </div>
            {Array.isArray(bookings) ? bookings.map((booking) => (
              <div key={booking._id || booking.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status || 'Pending'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <a href={`mailto:${booking.email}`} className="text-blue-600">{booking.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${booking.phone}`} className="text-blue-600">{booking.phone}</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📍</span>
                    <div className="flex-1">
                      <span className="text-gray-600 block">
                        {booking.address?.street 
                          ? `${booking.address.street}, ${booking.address.area || ''}, ${booking.address.city || 'Hyderabad'} - ${booking.address.pincode || ''}`
                          : booking.fullAddress || `${booking.address}, ${booking.area || ''}, ${booking.city || 'Hyderabad'} - ${booking.pincode || ''}`
                        }
                      </span>
                      <div className="mt-1 flex gap-2">
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(booking.fullAddress || `${booking.address?.street}, ${booking.address?.city}`)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          📍 View Map
                        </a>
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ text: `Customer address: ${booking.fullAddress || `${booking.address?.street}, ${booking.address?.city}`}` });
                            } else {
                              const address = booking.fullAddress || `${booking.address?.street}, ${booking.address?.city}`;
                              navigator.clipboard.writeText(`Customer address: ${address}`);
                              alert('Address copied to clipboard!');
                            }
                          }} 
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                  {(booking.technician?.name || booking.technicianName) && (
                    <div className="flex items-center gap-2">
                      <span>👨‍🔧</span>
                      <span>{booking.technician?.name || booking.technicianName} - {booking.technician?.phone || booking.technicianPhone}</span>
                      {(booking.technician?.email || booking.technicianEmail) && (
                        <div className="text-xs text-gray-600 ml-2">
                          📧 {booking.technician?.email || booking.technicianEmail || "N/A"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Manage
                  </button>
                  <div className="flex gap-1">
                    <a href={`tel:${booking.phone}`} className="p-2 bg-green-100 text-green-700 rounded-lg">
                      📞
                    </a>
                    <a href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-100 text-green-700 rounded-lg">
                      💬
                    </a>
                  </div>
                </div>
              </div>
            )) : []}

            {/* Booking Detail Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Manage Booking #{selectedBooking.bookingId || selectedBooking._id || selectedBooking.id}</h3>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 rounded-lg bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={selectedBooking.status || ''}
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== '') {
                            handleStatusChange(selectedBooking._id || selectedBooking.id, e.target.value);
                          }
                        }}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="" disabled>Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => handleAssignTechnician(selectedBooking._id || selectedBooking.id)}
                        className="p-3 bg-blue-600 text-white rounded-lg"
                      >
                        {(selectedBooking.technician?.name || selectedBooking.technicianName) ? 'Change Technician' : 'Assign Technician'}
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(selectedBooking._id || selectedBooking.id)}
                        className="p-3 bg-red-600 text-white rounded-lg"
                      >
                        Delete Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">User Reviews</h2>
              <button
                onClick={loadReviews}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                🔄 Refresh
              </button>
            </div>
            
            {Array.isArray(reviews) && reviews.length > 0 ? reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.username}</h3>
                    <p className="text-sm text-gray-600">{review.category}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.isVisible 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {review.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                      ))}
                    </span>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 italic mb-2">"{review.review}"</p>
                <p className="text-xs text-gray-500 mb-3">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {review.adminReply && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Admin reply:</p>
                    <p className="text-sm text-gray-700">{review.adminReply}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.adminReplyDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => handleReplyToReview(review._id, review.adminReply)}
                    className="py-2 px-3 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    {review.adminReply ? 'Edit Reply' : 'Reply'}
                  </button>
                  <button
                    onClick={() => handleToggleReviewApproval(review._id, review.status)}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      review.status === 'approved' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {review.status === 'approved' ? 'Mark Pending' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleToggleReviewVisibility(review._id, review.isVisible)}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      review.isVisible 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {review.isVisible ? 'Hide from Homepage' : 'Show on Homepage'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id, review.username)}
                    className="py-2 px-3 bg-red-600 text-white rounded-lg text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">⭐</div>
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Support Requests</h2>
            {supportRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{request.subject}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    request.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{request.issue}</p>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${request.email}`}
                    className="flex-1 text-center py-2 bg-red-600 text-white rounded-lg text-sm"
                  >
                    Email
                  </a>
                  <button
                    onClick={() => handleSupportStatusChange(request.id, request.status === 'Open' ? 'Resolved' : 'Open')}
                    className={`flex-1 py-2 rounded-lg text-sm ${
                      request.status === 'Open' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {request.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Management Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Services Management</h2>
            
            {/* Appliance Services */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Appliance Services
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Washing Machine', count: 4 },
                  { name: 'Refrigerator', count: 3 },
                  { name: 'Geyser', count: 2 },
                  { name: 'Water Purifier', count: 2 },
                  { name: 'Microven', count: 1 },
                  { name: 'AC', count: 4 }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.count} services</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600">✏️</button>
                      <button className="text-green-600">➕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Repair & Service */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Home Repair & Service
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Interior', count: 3 },
                  { name: 'Electrical Service', count: 3 },
                  { name: 'Home Maintenance & Services', count: 4 },
                  { name: 'Wall Painting', count: 3 },
                  { name: 'CCTV', count: 3 },
                  { name: 'AC Advanced Piping', count: 4 }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.count} services</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600">✏️</button>
                      <button className="text-green-600">➕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Category */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full p-3 border rounded-lg"
                />
                <select className="w-full p-3 border rounded-lg">
                  <option>Select Section</option>
                  <option>Appliance Services</option>
                  <option>Home Repair & Service</option>
                </select>
                <button className="w-full py-3 bg-red-600 text-white rounded-lg">
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Gallery</h2>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Add Image
              </button>
            </div>

            {showUpload && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Add New Media</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Image title"
                  />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded-lg"
                  />
                  <select
                    value={newImage.section}
                    onChange={(e) => setNewImage({ ...newImage, section: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option>Appliance Services</option>
                    <option>Home Repair & Service</option>
                  </select>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select category</option>
                    <option value="Washing Machine">Washing Machine</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Geyser">Geyser</option>
                    <option value="Water Purifier">Water Purifier</option>
                    <option value="Microven">Microven</option>
                    <option value="AC">AC</option>
                    <option value="Interior">Interior</option>
                    <option value="Electrical Service">Electrical Service</option>
                    <option value="Home Maintenance & Services">Home Maintenance & Services</option>
                    <option value="Wall Painting">Wall Painting</option>
                    <option value="CCTV">CCTV</option>
                    <option value="AC Advanced Piping">AC Advanced Piping</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpload}
                      className="flex-1 py-3 bg-red-600 text-white rounded-lg"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setShowUpload(false)}
                      className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {Array.isArray(images) && images.length > 0 ? images.map((image) => (
                <div key={image._id || image.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {image.mediaType === 'video' ? (
                    <video 
                      src={image.filePath || image.mediaData || image.url} 
                      className="w-full h-32 object-cover" 
                      controls
                    />
                  ) : (
                    <img 
                      src={image.filePath || image.mediaData || image.imageData || image.url} 
                      alt={image.title} 
                      className="w-full h-32 object-cover" 
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-800 truncate">{image.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{image.category}</p>
                    <p className="text-xs text-gray-500">{image.section}</p>
                    <button
                      onClick={() => handleDeleteImage(image._id || image.id)}
                      className="mt-2 w-full py-1 px-2 bg-red-600 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🖼️</div>
                  <p className="text-gray-500">No gallery images yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">All Users</h2>
            {Array.isArray(users) ? users.map((user) => (
              <div key={user.email} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      User
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name, user.email)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )) : []}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAdminDashboard;