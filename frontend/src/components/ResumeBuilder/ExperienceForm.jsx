import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { useResume } from "../../context/ResumeContext";
import { motion, AnimatePresence } from "framer-motion";
import { AppleLoader } from "@/components/ui/AppleLoader";
import { toast } from "sonner";
import { generateWithAI } from "@/services/aiGenerate";

const EMPTY_EXPERIENCE = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

export const ExperienceForm = () => {
  const { resumeData, updateExperience } = useResume();
  const [experience, setExperience] = useState(
    resumeData.experience.length > 0
      ? resumeData.experience
      : [{ ...EMPTY_EXPERIENCE }]
  );
  const [generatingIndex, setGeneratingIndex] = useState(null);

  // Keep form in sync when ATS / import updates context from outside
  useEffect(() => {
    setExperience(
      resumeData.experience.length > 0
        ? resumeData.experience
        : [{ ...EMPTY_EXPERIENCE }]
    );
  }, [resumeData.experience]);

  const handleAdd = () => {
    const newExperience = [
      ...experience,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ];
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleRemove = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleChange = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    if (field === "current" && value) {
      newExperience[index].endDate = "";
    }
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleGenerateDescription = async (index) => {
    const exp = experience[index];

    if (
      !exp.company ||
      exp.company.trim() === "" ||
      !exp.position ||
      exp.position.trim() === ""
    ) {
      toast.error("Enter company name and position first to generate a description.");
      return;
    }

    try {
      setGeneratingIndex(index);
      const generatedDescription = await generateWithAI({
        task: "experience",
        fields: {
          company: exp.company,
          position: exp.position,
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.current ? "Present" : exp.endDate || "",
        },
      });
      handleChange(index, "description", generatedDescription);
      toast.success("Description generated");
    } catch (err) {
      console.error("Error generating description:", err);
      toast.error(
        err.message || "Could not generate description. Please try again."
      );
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Work Experience
        </h2>
        <p className="text-sm text-muted-foreground">
          Describe your professional experience, starting with your most recent
          role.
        </p>
      </div>

      {experience.map((exp, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Experience #{index + 1}
            </h3>
            {experience.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                placeholder="Google Inc."
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Position *</Label>
              <Input
                placeholder="Senior Software Engineer"
                value={exp.position}
                onChange={(e) =>
                  handleChange(index, "position", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="San Francisco, CA"
                value={exp.location}
                onChange={(e) =>
                  handleChange(index, "location", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleChange(index, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleChange(index, "endDate", e.target.value)
                    }
                    disabled={exp.current}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id={`current-${index}`}
                checked={exp.current}
                onCheckedChange={(checked) =>
                  handleChange(index, "current", checked)
                }
              />
              <Label
                htmlFor={`current-${index}`}
                className="text-sm font-normal cursor-pointer"
              >
                I currently work here
              </Label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description * </Label>
              <button
                type="button"
                className="ml-2 text-xs flex gap-2 items-center no-underline text-decoration-none text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={() => handleGenerateDescription(index)}
                disabled={
                  generatingIndex === index ||
                  !exp.company ||
                  exp.company.trim() === "" ||
                  !exp.position ||
                  exp.position.trim() === ""
                }
              >
                Generate with AI <Sparkles className="w-4 h-4" />
              </button>
              <div className="relative">
                <AnimatePresence>
                  {generatingIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent pointer-events-none rounded-md z-10"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  animate={
                    generatingIndex === index
                      ? {
                          boxShadow: [
                            "0 0 0 0px rgba(59, 130, 246, 0.2)",
                            "0 0 0 3px rgba(59, 130, 246, 0.1)",
                            "0 0 0 0px rgba(59, 130, 246, 0.2)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: generatingIndex === index ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="rounded-md"
                >
                  <Textarea
                    placeholder={
                      generatingIndex === index
                        ? ""
                        : "• Led a team of 5 developers...\n• Improved system performance by 40%...\n• Implemented new features that increased user engagement..."
                    }
                    className={`min-h-[120px] relative transition-all ${
                      generatingIndex === index
                        ? "border-blue-300 bg-blue-50/30"
                        : ""
                    }`}
                    value={exp.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    disabled={generatingIndex === index}
                  />
                </motion.div>
                {generatingIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-blue-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100"
                  >
                    <AppleLoader size={14} tone="primary" />
                    <motion.span
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      AI is crafting your description
                    </motion.span>
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Use bullet points to describe your responsibilities and
                achievements
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">Tip:</span> Enter company name and
                position, then click "Generate with AI" to create professional
                bullet points.
              </p>
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Experience
      </Button>
    </div>
  );
};
