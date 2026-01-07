import { Router, Route } from 'wouter';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { ListingDetail } from './pages/ListingDetail';
import './App.css';
import { CategoryView } from './pages/CategoryView';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CreateListing } from './pages/CreateListing';
import { ListingForm } from './pages/ListingForm';
import { MyListings } from './pages/MyListings';
import { NotFound } from './pages/NotFound';
import { AdminSubmissions } from './pages/AdminSubmissions';
import { AdminPendingApprovals } from './pages/AdminPendingApprovals';
import { AdminAllListings } from './pages/AdminAllListings';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
        {/* Public Pages */}
        <Route path="/" component={Home} />
        <Route path="/listings" component={Listings} />
        <Route path="/listings/:id" component={ListingDetail} />
        <Route path="/categories/:slug" component={CategoryView} />
        
        <Route path="/search" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Search Results</h1>
            <p>Coming Soon - Search results page</p>
          </div>
        )} />

        {/* Authentication Pages */}
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        
        <Route path="/auth/forgot-password" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Forgot Password</h1>
            <p>Coming Soon - Password reset request page</p>
          </div>
        )} />
        
        <Route path="/auth/verify/:token" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Verify Email</h1>
            <p>Coming Soon - Email verification page</p>
          </div>
        )} />
        
        <Route path="/auth/reset/:token" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Reset Password</h1>
            <p>Coming Soon - Password reset page</p>
          </div>
        )} />

        {/* User Dashboard Pages */}
        <Route path="/dashboard" component={UserDashboard} />
        <Route path="/dashboard/listings" component={MyListings} />
        <Route path="/dashboard/listings/new" component={CreateListing} />
        <Route path="/dashboard/listings/:id/edit" component={ListingForm} />
        
        <Route path="/dashboard/submissions" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>My Submissions</h1>
            <p>Coming Soon - User submissions page</p>
          </div>
        )} />
        
        <Route path="/dashboard/profile" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>My Profile</h1>
            <p>Coming Soon - User profile page</p>
          </div>
        )} />
        
        <Route path="/dashboard/settings" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Account Settings</h1>
            <p>Coming Soon - Account settings page</p>
          </div>
        )} />

        {/* Admin Pages */}
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/listings/pending" component={AdminPendingApprovals} />
        <Route path="/admin/listings" component={AdminAllListings} />
        <Route path="/admin/submissions" component={AdminSubmissions} />
        
        <Route path="/admin/categories" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Manage Categories</h1>
            <p>Coming Soon - Admin categories management</p>
          </div>
        )} />
        
        <Route path="/admin/users" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Manage Users</h1>
            <p>Coming Soon - Admin users management</p>
          </div>
        )} />
        
        <Route path="/admin/packages" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Manage Packages</h1>
            <p>Coming Soon - Admin packages management</p>
          </div>
        )} />
        
        <Route path="/admin/stats" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>System Statistics</h1>
            <p>Coming Soon - System statistics page</p>
          </div>
        )} />
        
        <Route path="/admin/export" component={() => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Export Data</h1>
            <p>Coming Soon - Data export tools</p>
          </div>
        )} />

        {/* 404 Page */}
        <Route path="/:rest*" component={NotFound} />
      </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App;
