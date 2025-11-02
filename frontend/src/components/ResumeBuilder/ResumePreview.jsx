import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
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
  const { resumeData, selectedTemplate } = useResume();
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const TemplateComponent = templates[selectedTemplate] || ModernTemplate;

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
      const blob = await pdf(<PDFTemplateComponent data={resumeData} />).toBlob();
      
      console.log('PDF blob generated, size:', blob.size);

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
      toast.success('Resume downloaded successfully!', { id: toastId });
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
    <Card className="h-full flex flex-col bg-muted/30">
      <div className="p-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Resume Preview</h3>
        </div>
        <Button 
          onClick={handleDownloadPDF} 
          size="sm" 
          className="gap-2"
          disabled={isExporting}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div 
          ref={previewRef}
          className="bg-white shadow-xl mx-auto" 
          style={{ 
            width: '8.5in',
            minHeight: '11in',
            transformOrigin: 'top center'
          }}
        >
          <TemplateComponent data={resumeData} />
        </div>
      </div>
    </Card>
  );
};