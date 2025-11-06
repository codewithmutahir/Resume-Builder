import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, User, Mail, Calendar, Download, ArrowLeft, TrendingUp, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'sonner';

const Profile = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserResumes = async (showLoading = true) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      console.log('=== FETCHING RESUMES ===');
      console.log('Current user:', currentUser);
      console.log('User ID:', currentUser?.uid);
      console.log('User ID type:', typeof currentUser?.uid);
      
      if (!currentUser?.uid) {
        console.error('No user ID available!');
        toast.error('Please sign in to view your resumes');
        setResumes([]);
        return;
      }
      
      // First, try to fetch ALL resumes to see what's in the database
      try {
        const allResumesQuery = query(collection(db, 'resumes'));
        const allSnapshot = await getDocs(allResumesQuery);
        console.log(`Total resumes in database: ${allSnapshot.size}`);
        allSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`Resume ${doc.id}:`, {
            userId: data.userId,
            userIdType: typeof data.userId,
            fullName: data.fullName,
            template: data.template,
            createdAt: data.createdAt
          });
        });
      } catch (allError) {
        console.warn('Could not fetch all resumes (might be security rules):', allError);
      }
      
      // Now fetch user's resumes - try multiple strategies
      let resumesList = [];
      
      // Strategy 1: Query with userId and orderBy
      try {
        console.log('Strategy 1: Querying with userId and orderBy...');
        const resumesQuery1 = query(
          collection(db, 'resumes'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot1 = await getDocs(resumesQuery1);
        console.log(`Strategy 1 returned ${querySnapshot1.size} documents`);
        
        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          console.log('Resume (strategy 1):', {
            id: doc.id,
            userId: data.userId,
            fullName: data.fullName,
            template: data.template,
            downloadURL: data.downloadURL ? 'Present' : 'Missing',
            createdAt: data.createdAt
          });
          resumesList.push({
            id: doc.id,
            ...data
          });
        });
      } catch (orderByError) {
        console.warn('Strategy 1 failed (orderBy error):', orderByError);
        
        // Strategy 2: Query with userId without orderBy
        try {
          console.log('Strategy 2: Querying with userId (no orderBy)...');
          const resumesQuery2 = query(
            collection(db, 'resumes'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot2 = await getDocs(resumesQuery2);
          console.log(`Strategy 2 returned ${querySnapshot2.size} documents`);
          
          querySnapshot2.forEach((doc) => {
            const data = doc.data();
            console.log('Resume (strategy 2):', {
              id: doc.id,
              userId: data.userId,
              fullName: data.fullName,
              template: data.template,
              downloadURL: data.downloadURL ? 'Present' : 'Missing',
              createdAt: data.createdAt
            });
            resumesList.push({
              id: doc.id,
              ...data
            });
          });
        } catch (queryError) {
          console.warn('Strategy 2 failed:', queryError);
          
          // Strategy 3: Fetch all and filter client-side (fallback)
          try {
            console.log('Strategy 3: Fetching all resumes and filtering client-side...');
            const allResumesQuery = query(collection(db, 'resumes'));
            const allSnapshot = await getDocs(allResumesQuery);
            console.log(`Strategy 3: Found ${allSnapshot.size} total resumes`);
            
            allSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log('Checking resume:', {
                id: doc.id,
                storedUserId: data.userId,
                currentUserId: currentUser.uid,
                match: data.userId === currentUser.uid,
                fullName: data.fullName
              });
              
              // Match by userId or if userId is missing but email matches
              if (data.userId === currentUser.uid || 
                  (!data.userId && data.email === currentUser.email)) {
                console.log('✅ Match found! Adding resume:', doc.id);
                resumesList.push({
                  id: doc.id,
                  ...data
                });
              }
            });
            console.log(`Strategy 3: Filtered to ${resumesList.length} matching resumes`);
          } catch (allError) {
            console.error('Strategy 3 also failed:', allError);
            throw allError;
          }
        }
      }
      
      // Remove duplicates (in case multiple strategies found the same resume)
      const uniqueResumes = resumesList.reduce((acc, resume) => {
        if (!acc.find(r => r.id === resume.id)) {
          acc.push(resume);
        }
        return acc;
      }, []);
      
      resumesList = uniqueResumes;
      
      // Sort manually if orderBy failed
      resumesList.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order
      });
      
      console.log(`=== FOUND ${resumesList.length} RESUMES ===`);
      console.log('Resumes list:', resumesList);
      setResumes(resumesList);
      
      if (!showLoading && resumesList.length > 0) {
        toast.success(`Refreshed! Found ${resumesList.length} resume${resumesList.length > 1 ? 's' : ''}`);
      } else if (resumesList.length === 0 && !showLoading) {
        toast.info('No resumes found. Try downloading a PDF first.');
      }
    } catch (error) {
      console.error('=== ERROR FETCHING RESUMES ===');
      console.error('Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if it's a permissions error
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore security rules.');
      } else {
        toast.error(`Failed to load resumes: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserResumes();
    } else {
      setLoading(false);
      setResumes([]);
    }
  }, [currentUser?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handled in AuthContext
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (resume) => {
    if (!resume.downloadURL) {
      toast.error('Download URL not available for this resume');
      return;
    }

    try {
      // Open in new tab first
      window.open(resume.downloadURL, '_blank');
      
      // Also try to trigger download
      const link = document.createElement('a');
      link.href = resume.downloadURL;
      link.download = resume.fileName || `resume_${resume.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Resume downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume. Please try again.');
    }
  };

  const getTemplateColor = (template) => {
    const colors = {
      modern: 'from-blue-500 to-cyan-500',
      classic: 'from-gray-700 to-gray-900',
      minimal: 'from-gray-500 to-gray-700',
      elegant: 'from-gray-800 to-gray-600',
      creative: 'from-purple-500 to-blue-500'
    };
    return colors[template] || colors.modern;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="bg-card/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5 relative z-10 sticky top-0"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Builder
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Profile Header Card */}
          <Card className="p-6 bg-card/80 backdrop-blur-xl border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={currentUser?.photoURL || userData?.photoURL} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background text-2xl">
                  {getInitials(currentUser?.displayName || userData?.displayName || currentUser?.email)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {currentUser?.displayName || userData?.displayName || 'User'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{currentUser?.email}</span>
                  </div>
                  {userData?.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(userData.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <Card className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {userData?.resumeCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Resumes</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {resumes.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Saved</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Resume History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Resume History
              </h2>
              <Button
                onClick={() => fetchUserResumes(false)}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="gap-2"
              >
                {refreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            {resumes.length === 0 ? (
              <Card className="p-12 text-center bg-card/80 backdrop-blur-xl border-primary/20">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No resumes found</h3>
                <div className="space-y-4 mb-6">
                  <p className="text-muted-foreground">
                    {userData?.resumeCount > 0 
                      ? `You've generated ${userData.resumeCount} resume${userData.resumeCount > 1 ? 's' : ''}, but they're not showing here.`
                      : 'Start creating your first resume to see it here!'}
                  </p>
                  {userData?.resumeCount > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        🔍 Debugging Info:
                      </p>
                      <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>• Resume count: {userData.resumeCount}</li>
                        <li>• User ID: {currentUser?.uid?.substring(0, 20)}...</li>
                        <li>• Check browser console (F12) for detailed logs</li>
                        <li>• Try clicking "Refresh" button above</li>
                        <li>• Make sure you're signed in when downloading PDFs</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => fetchUserResumes(false)} variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Refresh
                  </Button>
                  <Button onClick={() => navigate('/')} className="gap-2">
                    <FileText className="w-4 h-4" />
                    Create Resume
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-5 bg-card/80 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg flex flex-col h-full">
                      {/* PDF Preview/Icon */}
                      <div className="mb-4 flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                        <FileText className={`w-16 h-16 ${getTemplateColor(resume.template).split(' ')[0].replace('from-', 'text-')} opacity-60`} />
                      </div>

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 truncate">
                            {resume.fullName || resume.resumeData?.personal?.fullName || 'Untitled Resume'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(resume.createdAt)}
                          </p>
                        </div>
                        <div className={`ml-2 px-2 py-1 rounded-md bg-gradient-to-r ${getTemplateColor(resume.template)} text-white text-xs font-medium capitalize flex-shrink-0`}>
                          {resume.template || 'modern'}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 flex-1">
                        {resume.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{resume.email}</span>
                          </p>
                        )}
                        {resume.fileName && (
                          <p className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{resume.fileName}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {resume.downloadURL ? (
                          <>
                            <Button
                              onClick={() => handleDownload(resume)}
                              className="flex-1 gap-2"
                              size="sm"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                            <Button
                              onClick={() => window.open(resume.downloadURL, '_blank')}
                              variant="outline"
                              size="sm"
                              className="px-3"
                              title="Open in new tab"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            disabled
                            className="w-full gap-2"
                            variant="outline"
                            size="sm"
                          >
                            <FileText className="w-4 h-4" />
                            No PDF Available
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

