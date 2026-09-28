import { AISuggestion } from '../types';

export interface ComplaintAnalysisContext {
  location?: string;
  branch?: string;
  year?: string;
  semester?: string;
  section?: string;
  type?: 'college' | 'hostel';
  hostelBlock?: string;
  selectedCategory?: string;
}

/**
 * Calls server-side proxy route `/api/gemini/analyze-complaint` to perform
 * real Gemini AI complaint analysis without exposing API keys or secrets in the browser.
 */
export async function analyzeComplaintWithAI(
  text: string,
  context?: ComplaintAnalysisContext
): Promise<AISuggestion> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Please describe the problem first.');
  }

  const response = await fetch('/api/gemini/analyze-complaint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: trimmed,
      type: context?.type || 'college',
      location: context?.location || '',
      branch: context?.branch || '',
      year: context?.year || '',
      semester: context?.semester || '',
      section: context?.section || '',
      category: context?.selectedCategory || '',
      hostelBlock: context?.hostelBlock || '',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || 'AI analysis is temporarily unavailable. You can submit the complaint manually.'
    );
  }

  const data: AISuggestion = await response.json();
  return data;
}
