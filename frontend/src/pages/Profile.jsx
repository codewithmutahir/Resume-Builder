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

  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!currentUser) return;

      try {
        const resumesQuery = query(
          collection(db, 'resumes'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(resumesQuery);
        const resumesList = [];
        
        querySnapshot.forEach((doc) => {
          resumesList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setResumes(resumesList);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast.error('Failed to load resume history');
      } finally {
        setLoading(false);
      }
    };

    fetchUserResumes();
  }, [currentUser]);

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

  const handleDownload = (downloadURL, fileName) => {
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Resume History
            </h2>

            {resumes.length === 0 ? (
              <Card className="p-12 text-center bg-card/80 backdrop-blur-xl border-primary/20">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start creating your first resume to see it here!
                </p>
                <Button onClick={() => navigate('/')} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Create Resume
                </Button>
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
                    <Card className="p-5 bg-card/80 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {resume.fullName || 'Untitled Resume'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(resume.createdAt)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-md bg-gradient-to-r ${getTemplateColor(resume.template)} text-white text-xs font-medium capitalize`}>
                          {resume.template}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {resume.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {resume.email}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={() => handleDownload(resume.downloadURL, resume.fileName)}
                        className="w-full gap-2"
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
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

