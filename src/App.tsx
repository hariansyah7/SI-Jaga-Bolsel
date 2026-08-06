import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ReportForm } from './components/ReportForm';
import { TrackingView } from './components/TrackingView';
import { LoginModal } from './components/LoginModal';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ReportManagement } from './components/admin/ReportManagement';
import { VerificationView } from './components/admin/VerificationView';
import { InvestigationView } from './components/admin/InvestigationView';
import { UserManagement } from './components/admin/UserManagement';
import { CategoryManagement } from './components/admin/CategoryManagement';
import { AuditTrailView } from './components/admin/AuditTrailView';
import { StatisticsReportView } from './components/admin/StatisticsReportView';
import { SystemSettingsView } from './components/admin/SystemSettingsView';

import { Complaint, User } from './types/wbs';
import { INITIAL_COMPLAINTS, INITIAL_USERS } from './data/mockData';
import { db, auth } from './lib/firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Tracking selection state
  const [selectedTicketForTracking, setSelectedTicketForTracking] = useState('');

  // Admin view state
  const [adminView, setAdminView] = useState('overview');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Sync Firebase Firestore complaints in real time
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Complaint[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Complaint);
          });
          setComplaints(list);
        }
      }, (err) => {
        console.warn("Firestore snapshot warning:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore listener fallback:", e);
    }
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser && currentUser) {
        // Logged out
      }
    });
    return () => unsubAuth();
  }, [currentUser]);

  const handleAddComplaint = async (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    try {
      await setDoc(doc(db, 'reports', newComplaint.id), newComplaint);
    } catch (err) {
      console.warn("Firestore save complaint error:", err);
    }
  };

  const handleUpdateComplaint = async (updated: Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    try {
      await setDoc(doc(db, 'reports', updated.id), updated);
    } catch (err) {
      console.warn("Firestore update complaint error:", err);
    }
  };

  const handleAddComment = async (ticketCode: string, commentText: string) => {
    let updatedComplaint: Complaint | null = null;
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketCode === ticketCode) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser ? currentUser.name : (c.reporter.isAnonymous ? 'Pelapor (Anonim)' : 'Pelapor'),
            role: currentUser ? currentUser.role : 'pelapor',
            text: commentText,
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
            isInternalOnly: false
          };
          updatedComplaint = { ...c, comments: [...c.comments, newComment] };
          return updatedComplaint;
        }
        return c;
      })
    );
    if (updatedComplaint) {
      try {
        await setDoc(doc(db, 'reports', (updatedComplaint as Complaint).id), updatedComplaint);
      } catch (err) {
        console.warn("Firestore update comment error:", err);
      }
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('admin');
    setAdminView('overview');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
    setCurrentUser(null);
    setActiveTab('home');
  };

  // If user is viewing internal admin panel
  if (activeTab === 'admin' && currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 antialiased">
        <AdminSidebar
          activeView={adminView}
          setActiveView={(view) => {
            if (view === 'landing') {
              setActiveTab('home');
            } else {
              setAdminView(view);
            }
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          reportCount={complaints.length}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            currentUser={currentUser}
            onLogout={handleLogout}
            setActiveView={setAdminView}
          />

          <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {adminView === 'overview' && (
              <DashboardOverview
                complaints={complaints}
                currentUser={currentUser}
                setActiveView={setAdminView}
                setSelectedComplaintId={setSelectedComplaintId}
              />
            )}

            {adminView === 'reports' && (
              <ReportManagement
                complaints={complaints}
                currentUser={currentUser}
                onUpdateComplaint={handleUpdateComplaint}
                selectedComplaintId={selectedComplaintId}
              />
            )}

            {adminView === 'verification' && (
              <VerificationView
                complaints={complaints}
                currentUser={currentUser}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}

            {adminView === 'investigation' && (
              <InvestigationView
                complaints={complaints}
                currentUser={currentUser}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}

            {adminView === 'users' && <UserManagement />}
            {adminView === 'categories' && <CategoryManagement />}
            {adminView === 'audit_logs' && <AuditTrailView />}
            {adminView === 'statistics' && <StatisticsReportView complaints={complaints} />}
            {adminView === 'settings' && <SystemSettingsView />}
          </main>
        </div>
      </div>
    );
  }

  // Public Web App
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900 antialiased">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'home' && <LandingPage setActiveTab={setActiveTab} />}
        
        {activeTab === 'report' && (
          <ReportForm
            onAddComplaint={handleAddComplaint}
            setActiveTab={setActiveTab}
            setSelectedTicketForTracking={setSelectedTicketForTracking}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingView
            complaints={complaints}
            initialTicketCode={selectedTicketForTracking}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
