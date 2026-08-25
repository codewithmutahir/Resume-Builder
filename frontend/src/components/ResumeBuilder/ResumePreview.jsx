import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Target } from 'lucide-react';
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
import { resolveTypography } from '@/constants/typography';
import { registerPdfFonts } from '@/utils/registerPdfFonts';
import { AppleLoader } from '@/components/ui/AppleLoader';
import { useNavigate } from 'react-router-dom';
import { AtsPanel } from '@/components/ResumeBuilder/AtsPanel';

const PENDING_DOWNLOAD_KEY = 'resume_pending_download';

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
  const { resumeData, selectedTemplate, templateColors, templateTypography } = useResume();
  const { incrementResumeCount, currentUser } = useAuth();
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const navigate = useNavigate();
  const autoDownloadTried = useRef(false);

  const TemplateComponent = templates[selectedTemplate] || ModernTemplate;
  const colors = templateColors[selectedTemplate] || templateColors.modern;
  const typography = resolveTypography(templateTypography?.[selectedTemplate]);

  const handleDownloadPDF = useCallback(async () => {
    if (isExporting) return;

    if (!currentUser) {
      sessionStorage.setItem(PENDING_DOWNLOAD_KEY, '1');
      toast.message('Sign in to download your resume');
      navigate('/login?next=/');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading('Generating PDF…', {
      icon: <AppleLoader size={14} />,
    });

    try {
      registerPdfFonts();

      const PDFTemplateComponent = templatesPDF[selectedTemplate] || ModernTemplatePDF;

      const blob = await pdf(
        <PDFTemplateComponent data={resumeData} colors={colors} typography={typography} />
      ).toBlob();

      toast.loading('Downloading…', {
        id: toastId,
        icon: <AppleLoader size={14} />,
      });

      let uploadSuccess = false;
      try {
        const uploadResult = await uploadPDFToFirebase(
          blob,
          resumeData,
          selectedTemplate,
          currentUser?.uid
        );
        uploadSuccess = true;

        if (currentUser) {
          await incrementResumeCount();
        }

        toast.success(`PDF downloaded! Document ID: ${uploadResult.documentId}`, {
          id: toastId,
          duration: 4000,
        });
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Upload failed: ${uploadError.message}`, {
          id: toastId,
          duration: 5000,
        });
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fullName = resumeData.personal?.fullName || 'resume';
      link.download = `${fullName.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (!uploadSuccess) {
        toast.success('Resume downloaded locally!', { id: toastId });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(`Failed to generate PDF: ${error.message}`, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  }, [
    isExporting,
    currentUser,
    navigate,
    selectedTemplate,
    resumeData,
    colors,
    typography,
    incrementResumeCount,
  ]);

  useEffect(() => {
    if (!currentUser || autoDownloadTried.current) return;
    if (sessionStorage.getItem(PENDING_DOWNLOAD_KEY) !== '1') return;
    autoDownloadTried.current = true;
    sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
    handleDownloadPDF();
  }, [currentUser, handleDownloadPDF]);

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-primary/10 via-white to-accent/10 border border-primary/20 shadow-xl shadow-primary/10 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-xl" />
      <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-white via-primary/5 to-accent/5 flex items-center justify-between backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">Resume Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => setAtsOpen(true)}
          >
            <Target className="w-4 h-4" />
            ATS Match
          </Button>
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md min-w-[140px]"
            disabled={isExporting}
          >
            {isExporting ? (
              <AppleLoader size={14} tone="light" label="Downloading" labelClassName="text-white" />
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/20">
        <div
          ref={previewRef}
          className="resume-document mx-auto"
          style={{
            width: '8.5in',
            minHeight: '11in',
            transformOrigin: 'top center',
          }}
        >
          <TemplateComponent data={resumeData} colors={colors} typography={typography} />
        </div>
      </div>

      <AtsPanel open={atsOpen} onOpenChange={setAtsOpen} />
    </Card>
  );
};
