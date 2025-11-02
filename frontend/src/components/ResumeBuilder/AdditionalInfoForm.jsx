import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const AdditionalInfoForm = () => {
  const { resumeData, updateCertifications, updateProjects, updateReferences } = useResume();
  
  const [certifications, setCertifications] = useState(resumeData.certifications);
  const [projects, setProjects] = useState(resumeData.projects);
  const [references, setReferences] = useState(resumeData.references);

  // Certifications handlers
  const handleAddCert = () => {
    const newCerts = [...certifications, { name: '', issuer: '', date: '', credentialId: '' }];
    setCertifications(newCerts);
    updateCertifications(newCerts);
  };

  const handleRemoveCert = (index) => {
    const newCerts = certifications.filter((_, i) => i !== index);
    setCertifications(newCerts);
    updateCertifications(newCerts);
  };

  const handleChangeCert = (index, field, value) => {
    const newCerts = [...certifications];
    newCerts[index][field] = value;
    setCertifications(newCerts);
    updateCertifications(newCerts);
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProjects = [...projects, { name: '', description: '', technologies: '', link: '' }];
    setProjects(newProjects);
    updateProjects(newProjects);
  };

  const handleRemoveProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    updateProjects(newProjects);
  };

  const handleChangeProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
    updateProjects(newProjects);
  };

  // References handlers
  const handleAddReference = () => {
    const newRefs = [...references, { name: '', title: '', company: '', email: '', phone: '' }];
    setReferences(newRefs);
    updateReferences(newRefs);
  };

  const handleRemoveReference = (index) => {
    const newRefs = references.filter((_, i) => i !== index);
    setReferences(newRefs);
    updateReferences(newRefs);
  };

  const handleChangeReference = (index, field, value) => {
    const newRefs = [...references];
    newRefs[index][field] = value;
    setReferences(newRefs);
    updateReferences(newRefs);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Additional Information</h2>
        <p className="text-sm text-muted-foreground">Add certifications, projects, and references to strengthen your resume (all optional).</p>
      </div>

      <Tabs defaultValue="certifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4 mt-4">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Certification #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCert(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    placeholder="AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) => handleChangeCert(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuing Organization</Label>
                  <Input
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => handleChangeCert(index, 'issuer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleChangeCert(index, 'date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credential ID (Optional)</Label>
                  <Input
                    placeholder="ABC123XYZ"
                    value={cert.credentialId}
                    onChange={(e) => handleChangeCert(index, 'credentialId', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={handleAddCert}
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 mt-4">
          {projects.map((project, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Project #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    placeholder="E-commerce Platform"
                    value={project.name}
                    onChange={(e) => handleChangeProject(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Developed a full-stack e-commerce platform with payment integration..."
                    className="min-h-[80px]"
                    value={project.description}
                    onChange={(e) => handleChangeProject(index, 'description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <Input
                    placeholder="React, Node.js, MongoDB, Stripe"
                    value={project.technologies}
                    onChange={(e) => handleChangeProject(index, 'technologies', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project Link (Optional)</Label>
                  <Input
                    placeholder="github.com/username/project"
                    value={project.link}
                    onChange={(e) => handleChangeProject(index, 'link', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={handleAddProject}
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </TabsContent>

        <TabsContent value="references" className="space-y-4 mt-4">
          {references.map((ref, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Reference #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveReference(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Jane Smith"
                    value={ref.name}
                    onChange={(e) => handleChangeReference(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Senior Manager"
                    value={ref.title}
                    onChange={(e) => handleChangeReference(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Acme Corporation"
                    value={ref.company}
                    onChange={(e) => handleChangeReference(index, 'company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="jane.smith@example.com"
                    value={ref.email}
                    onChange={(e) => handleChangeReference(index, 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 987-6543"
                    value={ref.phone}
                    onChange={(e) => handleChangeReference(index, 'phone', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={handleAddReference}
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reference
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};