import React, { useEffect, useState } from 'react';
import { Target, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { AppleLoader } from '@/components/ui/AppleLoader';
import { useResume } from '@/context/ResumeContext';
import {
  scoreResumeAts,
  rewriteForAts,
  loadStoredJobDescription,
  storeJobDescription,
} from '@/services/aiGenerate';
import { cn } from '@/lib/utils';

function ScoreRing({ score }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color =
    clamped >= 80
      ? 'text-emerald-600'
      : clamped >= 55
        ? 'text-amber-600'
        : 'text-rose-600';

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div
        className={cn(
          'relative flex h-24 w-24 items-center justify-center rounded-full border-4',
          clamped >= 80
            ? 'border-emerald-500/40 bg-emerald-50'
            : clamped >= 55
              ? 'border-amber-500/40 bg-amber-50'
              : 'border-rose-500/40 bg-rose-50'
        )}
      >
        <span className={cn('text-3xl font-semibold tabular-nums', color)}>
          {clamped}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">ATS match score</p>
    </div>
  );
}

function ChipList({ items, tone = 'muted' }) {
  if (!items?.length) {
    return <p className="text-xs text-muted-foreground">None</p>;
  }
  const toneClass =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-900 border-amber-200'
        : 'bg-muted text-muted-foreground border-border';

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            'inline-flex max-w-full truncate rounded-md border px-2 py-0.5 text-xs',
            toneClass
          )}
          title={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function AtsPanel({ open, onOpenChange }) {
  const {
    resumeData,
    updatePersonal,
    updateExperience,
    updateSkills,
  } = useResume();

  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [rewriting, setRewriting] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      setJobDescription(loadStoredJobDescription());
    }
  }, [open]);

  const handleAnalyze = async () => {
    if (analyzing || rewriting) return;

    const jd = jobDescription.trim();
    if (jd.length < 40) {
      toast.error('Paste a fuller job description (at least a few sentences).');
      return;
    }

    setAnalyzing(true);
    try {
      storeJobDescription(jd);
      const data = await scoreResumeAts({
        jobDescription: jd,
        resume: resumeData,
      });
      setResult(data);
      toast.success(`Match score: ${data.score}`);
    } catch (err) {
      toast.error(err.message || 'Could not analyze right now.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRewriteSummary = async () => {
    const current = resumeData.personal?.summary || '';
    if (current.trim().length < 20) {
      toast.error('Write or generate a summary first, then improve it.');
      return;
    }
    setRewriting('summary');
    try {
      const content = await rewriteForAts({
        target: 'summary',
        jobDescription,
        currentText: current,
      });
      updatePersonal({ summary: content });
      toast.success('Summary updated for this job');
      try {
        const data = await scoreResumeAts({
          jobDescription,
          resume: {
            ...resumeData,
            personal: { ...resumeData.personal, summary: content },
          },
        });
        setResult(data);
      } catch {
        // ignore refresh errors
      }
    } catch (err) {
      toast.error(err.message || 'Could not rewrite summary.');
    } finally {
      setRewriting(null);
    }
  };

  const handleRewriteExperience = async (index) => {
    const exp = resumeData.experience?.[index];
    if (!exp?.description || exp.description.trim().length < 20) {
      toast.error('Add a description for this role first.');
      return;
    }
    setRewriting(`exp-${index}`);
    try {
      const content = await rewriteForAts({
        target: 'experience',
        jobDescription,
        currentText: exp.description,
        position: exp.position,
        company: exp.company,
      });
      updateExperience((prev) =>
        (prev || []).map((item, i) =>
          i === index ? { ...item, description: content } : item
        )
      );
      toast.success(`Experience #${index + 1} updated`);
      try {
        const next = (resumeData.experience || []).map((item, i) =>
          i === index ? { ...item, description: content } : item
        );
        const data = await scoreResumeAts({
          jobDescription,
          resume: { ...resumeData, experience: next },
        });
        setResult(data);
      } catch {
        // ignore
      }
    } catch (err) {
      toast.error(err.message || 'Could not rewrite experience.');
    } finally {
      setRewriting(null);
    }
  };

  const handleAddMissingSkills = () => {
    if (!result?.missing?.length) return;

    const existing = new Set(
      (resumeData.skills || []).map((s) => String(s).toLowerCase())
    );
    const toAdd = result.missing
      .filter((k) => k.length >= 3 && !existing.has(k.toLowerCase()))
      .slice(0, 10)
      .map((k) => k.replace(/\b\w/g, (c) => c.toUpperCase()));

    if (!toAdd.length) {
      toast.message('Those keywords are already in your skills.');
      return;
    }

    updateSkills((prev) => [...(prev || []), ...toAdd]);
    toast.success(`Added ${toAdd.length} skill${toAdd.length > 1 ? 's' : ''}`);
  };

  const busy = analyzing || Boolean(rewriting);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md p-0"
      >
        <SheetHeader className="border-b border-border px-6 py-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            ATS Match
          </SheetTitle>
          <SheetDescription>
            Paste a job description to see keyword fit, then improve your resume
            for that role.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="ats-jd">Job description</Label>
            <Textarea
              id="ats-jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting here…"
              className="min-h-[140px] resize-y text-sm"
              disabled={busy}
            />
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={busy}
              className="w-full"
            >
              {analyzing ? (
                <AppleLoader size={14} tone="light" label="Analyzing" labelClassName="text-white" />
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Analyze match
                </>
              )}
            </Button>
          </div>

          {result && (
            <>
              <ScoreRing score={result.score} />

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Matched</h4>
                <ChipList items={result.matched} tone="good" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground">Missing</h4>
                  {result.missing.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={handleAddMissingSkills}
                      disabled={busy}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add to skills
                    </Button>
                  )}
                </div>
                <ChipList items={result.missing} tone="warn" />
              </div>

              {result.tips?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Tips</h4>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                    {result.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground">
                  Improve for this job
                </h4>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={handleRewriteSummary}
                  disabled={busy}
                >
                  {rewriting === 'summary' ? (
                    <AppleLoader size={14} label="Rewriting summary" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Rewrite summary
                    </>
                  )}
                </Button>

                {(resumeData.experience || []).map((exp, index) => (
                  <Button
                    key={`${exp.company}-${index}`}
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleRewriteExperience(index)}
                    disabled={busy}
                  >
                    {rewriting === `exp-${index}` ? (
                      <AppleLoader size={14} label="Rewriting" />
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">
                          Rewrite experience #{index + 1}
                          {exp.position ? ` — ${exp.position}` : ''}
                        </span>
                      </>
                    )}
                  </Button>
                ))}

                {(!resumeData.experience || resumeData.experience.length === 0) && (
                  <p className="text-xs text-muted-foreground">
                    Add work experience to rewrite role bullets for this JD.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AtsPanel;
