import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { ModernTemplate } from '@/components/ResumeTemplates/ModernTemplate';
import { ClassicTemplate } from '@/components/ResumeTemplates/ClassicTemplate';
import { MinimalTemplate } from '@/components/ResumeTemplates/MinimalTemplate';
import { ElegantTemplate } from '@/components/ResumeTemplates/ElegantTemplate';
import { CreativeTemplate } from '@/components/ResumeTemplates/CreativeTemplate';
import { ModernTemplatePDF } from '@/components/ResumeTemplates/ModernTemplatePDF';
import { ClassicTemplatePDF } from '@/components/ResumeTemplates/ClassicTemplatePDF';
import { MinimalTemplatePDF } from '@/components/ResumeTemplates/MinimalTemplatePDF';
import { ElegantTemplatePDF } from '@/components/ResumeTemplates/ElegantTemplatePDF';
import { CreativeTemplatePDF } from '@/components/ResumeTemplates/CreativeTemplatePDF';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { uploadPDFToFirebase } from '@/services/pdfStorage';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  elegant: ElegantTemplate,
  creative: CreativeTemplate
};

const templatesPDF = {
  modern: ModernTemplatePDF,
  classic: ClassicTemplatePDF,
  minimal: MinimalTemplatePDF,
  elegant: ElegantTemplatePDF,
  creative: CreativeTemplatePDF
};

export const ResumePreview = () => {
  const { resumeData, selectedTemplate, templateColors } = useResume();
  const { incrementResumeCount, currentUser } = useAuth();
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const TemplateComponent = templates[selectedTemplate] || ModernTemplate;
  const colors = templateColors[selectedTemplate] || templateColors.modern;

  const handleDownloadPDF = async () => {
    if (isExporting) return;

    setIsExporting(true);
    const toastId = toast.loading('Generating PDF...');

    try {
      console.log('Generating PDF with @react-pdf/renderer...');
      console.log('Selected template:', selectedTemplate);
      
      // Get the correct PDF template component based on selected template
      const PDFTemplateComponent = templatesPDF[selectedTemplate] || ModernTemplatePDF;
      
      // Generate the PDF blob using @react-pdf/renderer
      const blob = await pdf(<PDFTemplateComponent data={resumeData} colors={colors} />).toBlob();
      
      console.log('PDF blob generated, size:', blob.size);

      // Upload PDF to Cloudinary and save metadata to Firestore
      toast.loading('Downloading PDF...', { id: toastId });
      let uploadSuccess = false;
      try {
        console.log('Current user:', currentUser);
        console.log('User ID:', currentUser?.uid);
        console.log('User ID type:', typeof currentUser?.uid);
        
        if (!currentUser) {
          console.warn('⚠️ No current user! PDF will be saved without userId.');
        }
        
        const uploadResult = await uploadPDFToFirebase(blob, resumeData, selectedTemplate, currentUser?.uid);
        console.log('✅ PDF downloaded successfully:', uploadResult);
        uploadSuccess = true;
        
        // Increment resume count for the user
        if (currentUser) {
          await incrementResumeCount();
        }
        
        toast.success(`PDF downloaded! Document ID: ${uploadResult.documentId}`, { 
          id: toastId,
          duration: 4000 
        });
      } catch (uploadError) {
        console.error('❌ Upload error:', uploadError);
        console.error('Error message:', uploadError.message);
        // Continue with download even if upload fails
        toast.error(`Upload failed: ${uploadError.message}`, { 
          id: toastId,
          duration: 5000 
        });
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fullName = resumeData.personal?.fullName || 'resume';
      link.download = `${fullName.replace(/\s+/g, '_')}_resume.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);

      console.log('PDF downloaded successfully!');
      if (!uploadSuccess) {
        // Only show this if upload failed (success message already shown above)
        toast.success('Resume downloaded locally!', { id: toastId });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(`Failed to generate PDF: ${error.message}`, { 
        id: toastId, 
        duration: 5000 
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-primary/10 via-white to-accent/10 border border-primary/20 shadow-xl shadow-primary/10 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-xl" />
      <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-white via-primary/5 to-accent/5 flex items-center justify-between backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">Resume Preview</h3>
        </div>
        <Button 
          onClick={handleDownloadPDF} 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
          disabled={isExporting}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-6 md:p-8 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/20">
        <div 
          ref={previewRef}
          className="resume-document mx-auto" 
          style={{ 
            width: '8.5in',
            minHeight: '11in',
            transformOrigin: 'top center'
          }}
        >
          <TemplateComponent data={resumeData} colors={colors} />
        </div>
      </div>
    </Card>
  );
};