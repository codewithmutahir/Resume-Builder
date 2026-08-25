import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { AppleLoader } from '@/components/ui/AppleLoader';
import {
  completeLinkedInImport,
  stashLinkedInImportResult,
} from '@/services/linkedinImport';

/**
 * OAuth redirect target. Exchanges code, stashes profile, returns to builder.
 * Handles React Strict Mode double-mount without burning the one-time auth code.
 */
const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Connecting to LinkedIn…');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');

    let redirected = false;

    (async () => {
      try {
        const data = await completeLinkedInImport({
          code,
          state,
          error: oauthError,
        });
        stashLinkedInImportResult(data.personal);
        if (!redirected) {
          redirected = true;
          toast.success('Imported from LinkedIn — review your personal details.');
          navigate('/?linkedin_import=1', { replace: true });
        }
      } catch (err) {
        console.error(err);
        setMessage(err.message || 'Something went wrong.');
        toast.error(err.message || 'LinkedIn import failed.');
        setTimeout(() => {
          if (!redirected) {
            redirected = true;
            navigate('/', { replace: true });
          }
        }, 1600);
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/5 via-white to-accent/10 p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-lg">
        <Linkedin className="h-7 w-7" />
      </div>
      <AppleLoader size={18} label={message} />
    </div>
  );
};

export default LinkedInCallback;
