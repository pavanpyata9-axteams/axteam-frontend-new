import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { reviewService } from '../../services/reviewService';
import { useNavigate } from 'react-router-dom';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import MobileAdminDashboard from './MobileAdminDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();
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
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
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
      loadStats(),
      loadAllBookings(),
      loadImages(),
      loadSupportRequests(), 
      loadUsers(),
      loadReviews()
    ]);
  };

  // Load bookings from backend database
  const loadAllBookings = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [AdminDashboard] No auth token found');
        return;
      }

      console.log('🔍 [AdminDashboard] Loading all bookings from backend...');
      
      const response = await api.get('/admin/bookings/enhanced');

      const data = response.data;
      console.log('📊 [AdminDashboard] Backend response:', data);
      
      if (data.success && data.data.bookings) {
        const formattedBookings = data.data.bookings.map(booking => ({
          id: booking._id,
          bookingId: booking.bookingId,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          services: booking.services,
          servicesText: booking.servicesText || booking.services.map(s => s.serviceName).join(', '),
          address: booking.address,
          fullAddress: booking.fullAddress || `${booking.address.street}, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`,
          status: booking.status,
          date: booking.date,
          time: booking.time,
          workDescription: booking.workDescription,
          createdAt: booking.createdAt,
          _id: booking._id,
          // Enhanced fields
          hasLocation: booking.hasLocation,
          locationLink: booking.locationData?.coordinates?.latitude && booking.locationData?.coordinates?.longitude ? 
            `https://maps.app.goo.gl/?link=https://www.google.com/maps?q=${booking.locationData.coordinates.latitude},${booking.locationData.coordinates.longitude}` : 
            null,
          hasTechnician: booking.hasTechnician,
          technicianInfo: booking.technicianInfo,
          technician: booking.technician
        }));
        
        console.log('✅ [AdminDashboard] Loaded bookings:', formattedBookings.length);
        setBookings(formattedBookings);
      } else {
        console.error('❌ [AdminDashboard] Failed to load bookings:', data);
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error loading bookings:', error);
    }
  };

  // Load stats from database
  const loadStats = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) return;

      const response = await api.get('/admin/stats');

      const data = response.data;
      console.log('📊 Stats loaded from database:', data.data.stats);
      // Stats will be calculated in the component
    } catch (error) {
      console.error('❌ Failed to load stats:', error);
    }
  };

  const loadImages = () => {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    setImages(savedImages);
  };

  // DUPLICATE FUNCTION REMOVED - using loadAllBookings instead

  const loadSupportRequests = () => {
    const savedSupport = JSON.parse(localStorage.getItem('supportRequests') || '[]');
    setSupportRequests(savedSupport);
  };

  const loadUsers = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [AdminDashboard] No auth token for users');
        return;
      }

      console.log('🔍 [AdminDashboard] Loading all users from backend...');
      
      const response = await api.get('/admin/users');

      const data = response.data;
      console.log('👥 [AdminDashboard] Users response:', data);
      
      if (data.success && data.data.users) {
        setUsers(data.data.users);
        console.log('✅ [AdminDashboard] Loaded users:', data.data.users.length);
      } else {
        console.error('❌ [AdminDashboard] Failed to load users:', data);
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error loading users:', error);
    }
  };

  // Load reviews from backend
  const loadReviews = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [AdminDashboard] No auth token for reviews');
        return;
      }

      console.log('🔍 [AdminDashboard] Loading all reviews from backend...');
      
      const response = await reviewService.getAllReviews();
      
      if (response.success && response.data) {
        setReviews(response.data);
        console.log('✅ [AdminDashboard] Loaded reviews:', response.data.length);
      } else {
        console.error('❌ [AdminDashboard] Failed to load reviews:', response);
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error loading reviews:', error);
    }
  };

  // Reply to review
  const handleReplyToReview = async (review) => {
    setSelectedReview(review);
    setReplyText(review.adminReply?.text || '');
    setShowReplyModal(true);
  };

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      await reviewService.replyToReview(selectedReview._id, replyText);
      alert('Reply sent successfully!');
      setShowReplyModal(false);
      setSelectedReview(null);
      setReplyText('');
      await loadReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to reply to review:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  // Toggle review display status
  const handleToggleReviewDisplay = async (reviewId, currentStatus) => {
    try {
      await reviewService.updateReviewApproval(reviewId, {
        isDisplayedOnHomepage: !currentStatus
      });
      alert(`Review ${!currentStatus ? 'enabled' : 'hidden'} on homepage successfully!`);
      await loadReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Failed to update review status. Please try again.');
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      alert('Review deleted successfully!');
      await loadReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  // Delete user function
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
      
      console.log('🗑️ [AdminDashboard] Deleting user:', userId);
      
      const response = await api.delete(`/admin/users/${userId}`);
      
      const data = response.data;
      
      if (data.success) {
        alert(`✅ User Deleted Successfully!\n\n` +
              `• User: ${data.data.deletedUser}\n` +
              `• Deleted ${data.data.deletedBookings} booking(s)\n` +
              `• User can no longer login`);
        
        // Refresh both users and bookings
        await loadUsers();
        await loadAllBookings();
        
        console.log('✅ [AdminDashboard] User deleted and data refreshed');
      } else {
        alert(`❌ Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error deleting user:', error);
      alert('❌ Error deleting user. Please try again.');
    }
  };

  // Toggle user status function
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    
    const confirmToggle = window.confirm(
      `${newStatus ? '✅ ACTIVATE' : '🚫 DEACTIVATE'} USER?\n\n` +
      `This will ${action} the user's account.\n` +
      `${newStatus ? 'User will be able to login and book services.' : 'User will NOT be able to login or book services.'}\n\n` +
      `Continue?`
    );
    
    if (!confirmToggle) return;
    
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      console.log('🔄 [AdminDashboard] Toggling user status:', userId, 'to:', newStatus);
      
      const response = await api.patch(`/admin/users/${userId}/status`, { isActive: newStatus });
      
      const data = response.data;
      
      if (data.success) {
        alert(`✅ User ${newStatus ? 'Activated' : 'Deactivated'} Successfully!`);
        await loadUsers(); // Refresh user list
        console.log('✅ [AdminDashboard] User status updated');
      } else {
        alert(`❌ Failed to ${action} user: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error updating user status:', error);
      alert(`❌ Error ${action}ing user. Please try again.`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage({...newImage, file: file});
    }
  };

  const handleUpload = async () => {
    try {
      const file = newImage.file;
      if (!file || !newImage.title) {
        alert('Please fill all fields and select a file');
        return;
      }

      const newImageData = {
        id: Date.now(),
        title: newImage.title,
        category: newImage.category,
        section: newImage.section,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        mediaData: URL.createObjectURL(file),
        uploadDate: new Date().toLocaleDateString()
      };

      const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
      savedImages.push(newImageData);
      localStorage.setItem('galleryImages', JSON.stringify(savedImages));
      loadImages();
      setNewImage({ title: '', file: null, category: '', section: 'Appliance Services' });
      setShowUpload(false);
      alert('Media uploaded successfully!');
    } catch (error) {
      alert('Error uploading media');
    }
  };

  const handleDeleteImage = (id) => {
    if (window.confirm('Delete this image?')) {
      const updatedImages = images.filter(img => img.id !== id);
      localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
      loadImages();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Validate inputs
    if (!id) {
      console.error('❌ [AdminDashboard] No booking ID provided');
      alert('Error: No booking ID found. Please refresh the page and try again.');
      return;
    }

    if (!newStatus || newStatus === '') {
      console.error('❌ [AdminDashboard] No status provided');
      alert('Error: No status selected.');
      return;
    }

    // Validate status value
    const validStatuses = ['Pending', 'Confirmed', 'Completed'];
    if (!validStatuses.includes(newStatus)) {
      console.error('❌ [AdminDashboard] Invalid status provided:', newStatus);
      alert(`Error: Invalid status "${newStatus}". Valid statuses are: ${validStatuses.join(', ')}`);
      return;
    }

    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      console.log('🔄 [AdminDashboard] Updating booking status:', { id, newStatus });
      
      const response = await api.patch(`/bookings/status/${id}`, { status: newStatus });

      const data = response.data;
      
      if (data.success) {
        console.log('✅ [AdminDashboard] Status updated successfully');
        await loadAllBookings(); // Refresh from backend
        alert(`Booking status updated to ${newStatus}. Customer has been notified.`);
      } else {
        console.error('❌ [AdminDashboard] Failed to update status:', data);
        alert('Failed to update booking status. Please try again.');
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error updating status:', error);
      alert(`Error updating booking status: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Delete this booking?')) {
      const updatedBookings = bookings.filter(b => b.id !== id);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      loadAllBookings();
      setSelectedBooking(null);
    }
  };

  const handleAssignTechnician = async (id) => {
    const booking = bookings.find(b => b._id === id || b.id === id);
    if (!booking) {
      alert('Booking not found');
      return;
    }

    const customerName = booking.name;
    
    // Show detailed prompt with context
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

    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(technicianPhone.trim())) {
      alert('Please enter a valid phone number (minimum 10 digits).');
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
        await loadAllBookings();
        setSelectedBooking(null);
        
        // Show success message with details
        alert(`✅ Technician Assigned Successfully!\n\nTechnician: ${technicianName}\nPhone: ${technicianPhone}\nCustomer: ${customerName}\n\n📱 Notifications sent to:\n• Customer (WhatsApp & Email)\n• Technician (WhatsApp)\n• Admin (WhatsApp)\n\n${booking.status === 'Pending' ? 'Status updated to Confirmed.' : ''}`);
      } else {
        console.error('❌ Failed to assign technician:', data);
        alert(`Failed to assign technician: ${data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('❌ Technician assignment error:', error);
      alert('Failed to assign technician. Please check your connection and try again.');
    }
  };

  // Copy location link to clipboard
  const copyLocationLink = async (locationLink) => {
    if (!locationLink) {
      alert('No location link available');
      return;
    }

    try {
      await navigator.clipboard.writeText(locationLink);
      alert('Location link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = locationLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Location link copied to clipboard!');
    }
  };

  // Share location on WhatsApp
  const shareLocationOnWhatsApp = (booking) => {
    if (!booking.technician?.phone) {
      alert('No technician assigned yet');
      return;
    }

    if (!booking.locationLink) {
      alert('No location link available');
      return;
    }

    const message = encodeURIComponent(`Customer Location:\n${booking.locationLink}\n\nPlease navigate to this location.`);
    const technicianPhone = booking.technician.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${technicianPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Send complete info to technician
  const sendToTechnician = (booking) => {
    if (!booking.technician?.phone) {
      alert('No technician assigned yet');
      return;
    }

    const message = encodeURIComponent(
      `New Booking Assigned:\n\n` +
      `Customer: ${booking.name}\n` +
      `Phone: ${booking.phone}\n` +
      `Service: ${booking.servicesText}\n` +
      `Address: ${booking.fullAddress}\n` +
      `${booking.locationLink ? `Google Maps: ${booking.locationLink}\n` : ''}` +
      `Booking ID: ${booking.bookingId}\n\n` +
      `Please contact customer and visit location.`
    );
    
    const technicianPhone = booking.technician.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${technicianPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSupportStatusChange = (id, newStatus) => {
    const updatedSupport = supportRequests.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    );
    localStorage.setItem('supportRequests', JSON.stringify(updatedSupport));
    loadSupportRequests();
  };

  // OLD handleDeleteUser function removed - using new database version above

  // Export bookings to Excel
  const handleExportBookings = async () => {
    try {
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      console.log('📊 Exporting bookings...');

      const response = await api.get('/admin/export/bookings');

      if (response.data) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `AX-TEAM-Bookings-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('📊 Bookings exported successfully!');
      } else {
        const error = response.data;
        alert(`Failed to export bookings: ${error.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('❌ Export error:', error);
      alert('Failed to export bookings. Please check your connection and try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('axteamAuth');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Use mobile version for mobile devices only
  if (isMobile) {
    return <MobileAdminDashboard />;
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Professional Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-red-600">AX TEAM</h1>
          <p className="text-sm text-gray-600">Admin Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-red-50 text-red-700 border-r-4 border-red-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-lg mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-600">Manage your {activeTab} efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">Administrator</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-3xl font-bold text-gray-900">{stats.totalUsers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 px-6 py-3">
                  <div className="text-sm text-blue-600 font-medium">Active accounts</div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl">📅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                        <dd className="text-3xl font-bold text-gray-900">{stats.totalBookings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 px-6 py-3">
                  <div className="text-sm text-green-600 font-medium">All time bookings</div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl">⏳</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 px-6 py-3">
                  <div className="text-sm text-yellow-600 font-medium">Awaiting action</div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl">🎧</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Support</dt>
                        <dd className="text-3xl font-bold text-gray-900">{stats.supportRequests}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 px-6 py-3">
                  <div className="text-sm text-purple-600 font-medium">Open requests</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <span className="text-lg mr-2">📅</span>
                    <span>Manage Bookings</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('gallery')}
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-lg mr-2">🖼️</span>
                    <span>Upload Images</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span className="text-lg mr-2">🔧</span>
                    <span>Manage Services</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow-lg rounded-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📅</div>
                    <p className="text-gray-500">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.servicesText || 'Service booking'}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                <p className="text-sm text-gray-600">Manage customer service requests</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleExportBookings}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📊 Export Excel
                </button>
                <button 
                  onClick={loadAllBookings}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">When customers book services, they'll appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id || booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">{booking.servicesText || 'Service Booking'}</div>
                            <div className="text-sm text-gray-500">
                              {booking.fullAddress ? `${booking.fullAddress.substring(0, 40)}...` : 'No address'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Booking ID: {booking.bookingId}
                            </div>
                            {booking.locationLink && (
                              <div className="mt-2">
                                <div className="text-xs text-blue-600 mb-1">Location:</div>
                                <a 
                                  href={booking.locationLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 underline block truncate max-w-xs"
                                >
                                  🔗 {booking.locationLink}
                                </a>
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => copyLocationLink(booking.locationLink)}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                    title="Copy Link"
                                  >
                                    📋
                                  </button>
                                  <button
                                    onClick={() => shareLocationOnWhatsApp(booking)}
                                    className={`text-xs px-2 py-1 rounded ${
                                      booking.technician?.phone 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    disabled={!booking.technician?.phone}
                                    title="Share on WhatsApp"
                                  >
                                    💬
                                  </button>
                                  <button
                                    onClick={() => sendToTechnician(booking)}
                                    className={`text-xs px-2 py-1 rounded ${
                                      booking.technician?.phone 
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    disabled={!booking.technician?.phone}
                                    title="Send to Technician"
                                  >
                                    📤
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <a href={`tel:${booking.phone}`} className="text-sm text-blue-600 hover:text-blue-800 block">
                                📞 {booking.phone}
                              </a>
                              <a href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-800 block">
                                💬 WhatsApp
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {booking.fullAddress ? booking.fullAddress.substring(0, 50) + (booking.fullAddress.length > 50 ? '...' : '') : 'No address'}
                            </div>
                            <div className="mt-2 space-y-1">
                              <a 
                                href={`https://maps.google.com/?q=${encodeURIComponent(booking.fullAddress || `${booking.address?.street}, ${booking.address?.city}`)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline block"
                              >
                                📍 View Map
                              </a>
                              <button 
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({ text: `Customer address: ${booking.fullAddress}` });
                                  } else {
                                    navigator.clipboard.writeText(`Customer address: ${booking.fullAddress}`);
                                    alert('Address copied to clipboard!');
                                  }
                                }} 
                                className="text-xs text-blue-600 hover:text-blue-800 underline block"
                              >
                                Share
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking._id || booking.id, e.target.value)}
                              className={`px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 ${
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.hasTechnician ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{booking.technicianInfo?.name}</div>
                                <div className="text-gray-500">{booking.technicianInfo?.phone}</div>
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                                  Assigned
                                </span>
                                {booking.hasLocation && (
                                  <div className="mt-1">
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                      📍 Location Available
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm">
                                <span className="text-gray-400">Not assigned</span>
                                <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mt-1">
                                  Pending
                                </span>
                                {booking.hasLocation && (
                                  <div className="mt-1">
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                      📍 Location Available
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              {!booking.hasTechnician ? (
                                <button
                                  onClick={() => handleAssignTechnician(booking._id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                                  title="Assign Technician"
                                >
                                  👨‍🔧 Assign Tech
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAssignTechnician(booking._id)}
                                  className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-xs font-medium"
                                  title="Reassign Technician"
                                >
                                  ✏️ Edit Tech
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="text-green-600 hover:text-green-900"
                                title="View Details"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Booking"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <p className="text-sm text-gray-600">Manage customer feedback and responses</p>
              </div>
              <button 
                onClick={loadReviews}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="bg-white shadow-lg rounded-xl">
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Customer reviews will appear here when they're submitted.</p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 mr-3">{review.customerName}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-lg">
                                  {i < review.rating ? '⭐' : '☆'}
                                </span>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{review.serviceName} • {review.serviceCategory}</p>
                          <blockquote className="text-gray-800 italic border-l-4 border-gray-300 pl-4 mb-3">
                            "{review.feedback}"
                          </blockquote>
                          <p className="text-xs text-gray-500">
                            Reviewed on {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            review.isDisplayedOnHomepage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {review.isDisplayedOnHomepage ? 'Visible' : 'Hidden'}
                          </span>
                          {review.isApproved && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Approved
                            </span>
                          )}
                        </div>
                      </div>

                      {review.adminReply && review.adminReply.text && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center mb-2">
                            <span className="text-red-600 font-medium text-sm">AX Team Response:</span>
                            <span className="ml-2 text-xs text-red-500">
                              {new Date(review.adminReply.repliedAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{review.adminReply.text}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleReplyToReview(review)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {review.adminReply?.text ? '✏️ Edit Reply' : '💬 Reply'}
                        </button>
                        <button
                          onClick={() => handleToggleReviewDisplay(review._id, review.isDisplayedOnHomepage)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                            review.isDisplayedOnHomepage 
                              ? 'bg-orange-600 text-white hover:bg-orange-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {review.isDisplayedOnHomepage ? '👁️‍🗨️ Hide' : '👁️ Show'} on Homepage
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage registered users and their access</p>
              </div>
              <button 
                onClick={loadUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Refresh Users
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              {users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users yet</h3>
                  <p className="text-gray-600">Registered users will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {user.role !== 'admin' && (
                                <>
                                  <button
                                    onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                    className={`px-3 py-1 rounded text-xs font-medium ${
                                      user.isActive !== false 
                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                  >
                                    {user.isActive !== false ? '🚫 Deactivate' : '✅ Activate'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id, user.name, user.email)}
                                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200"
                                  >
                                    🗑️ Delete
                                  </button>
                                </>
                              )}
                              {user.role === 'admin' && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                  Protected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Media Gallery</h3>
                <p className="text-sm text-gray-600">Upload and manage service portfolio images</p>
              </div>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                📁 Upload Media
              </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Upload New Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Title</label>
                    <input
                      type="text"
                      value={newImage.title}
                      onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter media title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      value={newImage.section}
                      onChange={(e) => setNewImage({ ...newImage, section: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option>Appliance Services</option>
                      <option>Home Repair & Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newImage.category}
                      onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowUpload(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Upload Media
                  </button>
                </div>
              </div>
            )}

            {/* Media Grid */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              {images.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🖼️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No media uploaded</h3>
                  <p className="text-gray-600">Start building your portfolio by uploading images and videos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((image) => (
                    <div key={image.id} className="group relative bg-gray-50 rounded-lg overflow-hidden">
                      {image.mediaType === 'video' ? (
                        <video 
                          src={image.mediaData || image.url} 
                          className="w-full h-48 object-cover" 
                          controls
                        />
                      ) : (
                        <img 
                          src={image.mediaData || image.imageData || image.url} 
                          alt={image.title} 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 truncate">{image.title}</h4>
                        <p className="text-sm text-gray-600">{image.category}</p>
                        <p className="text-xs text-gray-500 mt-1">{image.uploadDate}</p>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="mt-3 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage registered users and their accounts</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              {users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users registered</h3>
                  <p className="text-gray-600">User accounts will appear here when people sign up.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.email} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-lg">
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">Customer</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Review Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-2xl font-bold text-gray-800">Reply to Review</h3>
              <button 
                onClick={() => setShowReplyModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* Review Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-gray-900 mr-3">{selectedReview.customerName}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < selectedReview.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({selectedReview.rating}/5)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{selectedReview.serviceName}</p>
                <p className="text-gray-800 italic">"{selectedReview.feedback}"</p>
              </div>
              
              {/* Reply Text Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Write a professional response to this customer review..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This reply will be publicly visible on the website alongside the review.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitReply}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedReview(null);
                    setReplyText('');
                  }}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;