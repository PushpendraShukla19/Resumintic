
'use client';

import { useState, useEffect, useRef } from 'react';
import type { ResumeData, Template, WorkExperience, Education, Project } from '@/types/resume';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, UploadCloud, Sparkles, Download, Palette, MessageSquare, FileText, Target, PlusCircle, XCircle, FileSignature, CalendarIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractResumeData, type ExtractResumeDataInput } from '@/ai/flows/extract-resume-data';
import { addAtsKeywords } from '@/ai/flows/add-ats-keywords';
import { suggestImprovements } from '@/ai/flows/suggest-improvements';
import { calculateAtsScore } from '@/ai/flows/calculate-ats-score';
import { suggestResumeFieldContent, type SuggestResumeFieldContentInput } from '@/ai/flows/suggest-resume-field-content';
import { convertFileToDataUri, formatResumeDataToText } from '@/lib/utils';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parse } from 'date-fns';
import type { Metadata } from 'next';


// Import Template Components
import ModernTemplate from '@/components/resume-templates/ModernTemplate';
import ClassicTemplate from '@/components/resume-templates/ClassicTemplate';
import CreativeTemplate from '@/components/resume-templates/CreativeTemplate';
import TechnicalTemplate from '@/components/resume-templates/TechnicalTemplate';
import AcademicTemplate from '@/components/resume-templates/AcademicTemplate';
import InfographicTemplate from '@/components/resume-templates/InfographicTemplate';
import MinimalistTemplate from '@/components/resume-templates/MinimalistTemplate';
import ExecutiveTemplate from '@/components/resume-templates/ExecutiveTemplate';
import TypographicTemplate from '@/components/resume-templates/TypographicTemplate';
import EntryLevelTemplate from '@/components/resume-templates/EntryLevelTemplate';

export const pageMetadata: Metadata = {
  title: 'Build Your Resume | Resumintic AI Tool',
  description: 'Use the Resumintic AI resume builder tool to upload, create, or enhance your resume with ATS-friendly templates and AI suggestions.',
  robots: 'noindex, follow', 
};


const availableTemplates: Template[] = [
  { id: 'modern', name: 'Modern Professional', previewImageUrl: 'https://placehold.co/300x420.png?text=Modern', description: 'Sleek, contemporary design for impactful roles.', component: ModernTemplate, dataAiHint: 'modern resume' },
  { id: 'classic', name: 'Classic Formal', previewImageUrl: 'https://placehold.co/300x420.png?text=Classic', description: 'Timeless, traditional layout for established fields.', component: ClassicTemplate, dataAiHint: 'classic resume' },
  { id: 'creative', name: 'Creative Minimalist', previewImageUrl: 'https://placehold.co/300x420.png?text=Creative', description: 'Stylish and clean, perfect for creative industries.', component: CreativeTemplate, dataAiHint: 'creative resume' },
  { id: 'technical', name: 'Tech Savvy', previewImageUrl: 'https://placehold.co/300x420.png?text=Tech', description: 'Clear, structured, ideal for technical roles.', component: TechnicalTemplate, dataAiHint: 'tech resume' },
  { id: 'academic', name: 'Academic Standard', previewImageUrl: 'https://placehold.co/300x420.png?text=Academic', description: 'Simple, clear hierarchy for CVs and academic use.', component: AcademicTemplate, dataAiHint: 'academic resume' },
  { id: 'infographic', name: 'Visual Infographic', previewImageUrl: 'https://placehold.co/300x420.png?text=Infographic', description: 'Visually engaging, data-driven presentation.', component: InfographicTemplate, dataAiHint: 'infographic resume' },
  { id: 'minimalist', name: 'Clean Minimalist', previewImageUrl: 'https://placehold.co/300x420.png?text=Minimalist', description: 'Focus on typography and essential content.', component: MinimalistTemplate, dataAiHint: 'minimalist resume' },
  { id: 'executive', name: 'Executive', previewImageUrl: 'https://placehold.co/300x420.png?text=Executive', description: 'Sophisticated design for senior-level professionals.', component: ExecutiveTemplate, dataAiHint: 'executive resume' },
  { id: 'typographic', name: 'Typographic Focus', previewImageUrl: 'https://placehold.co/300x420.png?text=Typographic', description: 'Strong typography and clean grid layout.', component: TypographicTemplate, dataAiHint: 'typographic resume' },
  { id: 'entry-level', name: 'Entry-Level Friendly', previewImageUrl: 'https://placehold.co/300x420.png?text=EntryLevel', description: 'Highlights skills and projects for early-career individuals.', component: EntryLevelTemplate, dataAiHint: 'entry-level resume' },
];

const initialManualFormData: ResumeData = {
  name: '',
  contactInfo: { email: '', phone: '', linkedin: '', github: '' },
  summary: '',
  skills: [],
  workExperience: [],
  education: [],
  projects: [],
};

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [currentResumeText, setCurrentResumeText] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>(''); 
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(availableTemplates[0]);
  
  const [isLoadingExtract, setIsLoadingExtract] = useState<boolean>(false); 
  const [isLoadingKeywords, setIsLoadingKeywords] = useState<boolean>(false);
  const [isLoadingImprovements, setIsLoadingImprovements] = useState<boolean>(false);
  const [isLoadingReparse, setIsLoadingReparse] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsScoreJustification, setAtsScoreJustification] = useState<string | null>(null);
  const [isLoadingAtsScore, setIsLoadingAtsScore] = useState<boolean>(false);

  const [inputMode, setInputMode] = useState<'file' | 'form'>('file');
  const [manualFormData, setManualFormData] = useState<ResumeData>(structuredClone(initialManualFormData));
  const [skillsInput, setSkillsInput] = useState<string>('');
  
  const [jobRoleForSuggestions, setJobRoleForSuggestions] = useState<string>('');
  const [isSuggestingFor, setIsSuggestingFor] = useState<string | null>(null);


  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resumeData) {
      setCurrentResumeText(formatResumeDataToText(resumeData));
      // Trigger ATS calculation whenever resumeData changes and is not null
      triggerAtsCalculation(resumeData);
    } else {
      // Clear relevant states if resumeData becomes null
      setCurrentResumeText('');
      setAtsScore(null);
      setAtsScoreJustification(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  const triggerAtsCalculation = async (data: ResumeData) => {
    if (!data || !data.name) { // Basic check
        setAtsScore(null);
        setAtsScoreJustification(null);
        return;
    }
    setIsLoadingAtsScore(true);
    try {
      const scoreData = await calculateAtsScore({
        name: data.name,
        summary: data.summary,
        skills: data.skills,
        workExperience: data.workExperience.map(exp => ({...exp, endDate: exp.isCurrent ? undefined : exp.endDate})), 
        education: data.education,
      });
      setAtsScore(scoreData.atsScore);
      setAtsScoreJustification(scoreData.justification);
      toast({ title: 'ATS Score Updated', description: `Your ATS score is ${scoreData.atsScore}/100.` });
    } catch (scoreError) {
      console.error('Error calculating ATS score:', scoreError);
      toast({ title: 'ATS Score Error', description: 'Failed to calculate ATS score.', variant: 'destructive' });
      setAtsScore(null);
      setAtsScoreJustification(null);
    } finally {
      setIsLoadingAtsScore(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: 'Invalid File Type', description: 'Please upload a PDF or DOCX file.', variant: 'destructive' });
      return;
    }

    setIsLoadingExtract(true);
    setResumeData(null); // Clear previous data
    setManualFormData(structuredClone(initialManualFormData));
    setSkillsInput('');


    try {
      let extractionInput: ExtractResumeDataInput;
      if (file.type === 'application/pdf') {
        const dataUri = await convertFileToDataUri(file);
        extractionInput = { resumePdfDataUri: dataUri };
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });
        extractionInput = { resumeText: textContent };
      } else {
        toast({ title: 'Unsupported File Type', description: 'An unexpected error occurred.', variant: 'destructive' });
        setIsLoadingExtract(false);
        return;
      }
      
      const extractedData = await extractResumeData(extractionInput);
      const processedExtractedData = {
        ...extractedData,
        workExperience: extractedData.workExperience.map(exp => ({
          ...exp,
          isCurrent: !exp.endDate || exp.endDate.toLowerCase() === 'present',
          endDate: (!exp.endDate || exp.endDate.toLowerCase() === 'present') ? 'Present' : exp.endDate,
        })),
      };
      setResumeData(processedExtractedData); // This will trigger ATS calculation via useEffect
      toast({ title: 'Success', description: 'Resume data extracted successfully.' });
      setActiveTab("enhance"); 
    } catch (error) {
      console.error('Error processing resume:', error);
      let description = 'Failed to process resume. Please try again.';
      if (error instanceof Error && error.message.includes('mammoth')) {
        description = 'Failed to parse DOCX file. Please ensure it is a valid .docx file.';
      } else if (error instanceof Error && error.message.includes('extractResumeData')) {
        description = 'AI failed to extract data from the resume. Try a different format or simplify the document.';
      }
      toast({ title: 'Error', description, variant: 'destructive' });
      setResumeData(null); // Ensure resumeData is null on error
    } finally {
      setIsLoadingExtract(false);
    }
  };

  const handleManualFormChange = (section: keyof ResumeData | 'workExperience.isCurrent', value: any, subField?: keyof WorkExperience | keyof Education | keyof Project | keyof ResumeData['contactInfo'], index?: number) => {
    setManualFormData(prev => {
      const newState = structuredClone(prev);
      if (index !== undefined && section === 'workExperience' && subField) {
        (newState.workExperience[index] as any)[subField as keyof WorkExperience] = value;
      } else if (index !== undefined && section === 'workExperience.isCurrent') { 
        newState.workExperience[index].isCurrent = value as boolean;
        if (value) {
          newState.workExperience[index].endDate = 'Present';
        } else {
          if (newState.workExperience[index].endDate === 'Present') {
            newState.workExperience[index].endDate = ''; 
          }
        }
      } else if (index !== undefined && section === 'education' && subField) {
        (newState.education[index]as any)[subField as keyof Education] = value;
      } else if (index !== undefined && section === 'projects' && subField) {
        (newState.projects[index]as any)[subField as keyof Project] = value;
      } else if (section === 'contactInfo' && subField) {
        (newState.contactInfo as any)[subField as keyof ResumeData['contactInfo']] = value;
      }
       else if (section !== 'workExperience.isCurrent') { 
        (newState as any)[section] = value;
      }
      return newState;
    });
  };

  const addItem = (section: 'workExperience' | 'education' | 'projects') => {
    setManualFormData(prev => {
      const newState = structuredClone(prev);
      if (section === 'workExperience') {
        newState.workExperience.push({ title: '', company: '', startDate: '', endDate: '', description: '', isCurrent: false });
      } else if (section === 'education') {
        newState.education.push({ institution: '', degree: '', startDate: '', endDate: '' });
      } else if (section === 'projects') {
        newState.projects.push({ name: '', description: '' });
      }
      return newState;
    });
  };

  const removeItem = (section: 'workExperience' | 'education' | 'projects', index: number) => {
    setManualFormData(prev => {
      const newState = structuredClone(prev);
      if (section === 'workExperience') {
        newState.workExperience.splice(index, 1);
      } else if (section === 'education') {
        newState.education.splice(index, 1);
      } else if (section === 'projects') {
        newState.projects.splice(index, 1);
      }
      return newState;
    });
  };
  
  const handleSkillsInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkillsInput(e.target.value);
  };

  const parseSkillsInput = () => {
    if (skillsInput.trim() === '') {
      handleManualFormChange('skills', []);
    } else {
      const skillsArray = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      handleManualFormChange('skills', skillsArray);
    }
  };


  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    parseSkillsInput(); 

    setIsLoadingExtract(true); 
    setResumeData(null); // Clear previous data
    
    const submittedFormData = structuredClone(manualFormData);
    if (skillsInput.trim() !== '') {
        submittedFormData.skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    } else {
        submittedFormData.skills = [];
    }
    
    submittedFormData.workExperience = submittedFormData.workExperience.map(exp => ({
        ...exp,
        endDate: exp.isCurrent ? 'Present' : exp.endDate,
    }));


    setResumeData(submittedFormData); // This will trigger ATS calculation via useEffect
    toast({ title: 'Success', description: 'Resume data submitted successfully.' });
    
    setIsLoadingExtract(false);
    setActiveTab("enhance");
  };

  const handleAiSuggestContent = async (
    fieldType: 'summary' | 'skills' | 'experienceDescription' | 'projectDescription',
    index?: number,
    itemContext?: any 
  ) => {
    if (!jobRoleForSuggestions) {
      toast({ title: "Job Role Required", description: "Please enter a target job role for AI suggestions.", variant: "destructive" });
      return;
    }

    const suggestionKey = index !== undefined ? `${fieldType}-${index}` : fieldType;
    setIsSuggestingFor(suggestionKey);

    try {
      const input: SuggestResumeFieldContentInput = {
        targetJobRole: jobRoleForSuggestions,
        fieldType,
        existingName: manualFormData.name || undefined,
        existingSummary: fieldType !== 'summary' ? manualFormData.summary || undefined : undefined,
        existingSkillsText: fieldType !== 'skills' ? skillsInput || undefined : undefined,
        contextData: itemContext,
      };

      const result = await suggestResumeFieldContent(input);

      if (result.suggestedContent) {
        if (fieldType === 'summary') {
          handleManualFormChange('summary', result.suggestedContent);
        } else if (fieldType === 'skills') {
          setSkillsInput(result.suggestedContent);
          const skillsArray = result.suggestedContent.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
          handleManualFormChange('skills', skillsArray);
        } else if (fieldType === 'experienceDescription' && index !== undefined) {
          handleManualFormChange('workExperience', result.suggestedContent, 'description', index);
        } else if (fieldType === 'projectDescription' && index !== undefined) {
          handleManualFormChange('projects', result.suggestedContent, 'description', index);
        }
        toast({ title: "AI Suggestion Applied", description: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} updated.` });
      } else {
        toast({ title: "No Suggestion", description: "AI could not generate a suggestion for this field.", variant: "default" });
      }
    } catch (error) {
      console.error(`Error suggesting content for ${fieldType}:`, error);
      toast({ title: "AI Suggestion Error", description: `Failed to get suggestion for ${fieldType}.`, variant: "destructive" });
    } finally {
      setIsSuggestingFor(null);
    }
  };


  const handleAddAtsKeywords = async () => {
    if (!currentResumeText || !jobRole) {
      toast({ title: 'Missing Information', description: 'Please ensure resume text and target job role (in this tab) are provided.', variant: 'destructive' });
      return;
    }
    setIsLoadingKeywords(true);
    try {
      const result = await addAtsKeywords({ resumeText: currentResumeText, jobRole });
      setCurrentResumeText(result.enhancedResume);
      toast({ title: 'Success', description: 'ATS keywords added to your resume text. Click "Apply Text Edits" to update your structured resume data and ATS score.' });
    } catch (error) {
      console.error('Error adding ATS keywords:', error);
      toast({ title: 'Error', description: 'Failed to add ATS keywords.', variant: 'destructive' });
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  const handleSuggestImprovements = async () => {
    if (!currentResumeText) {
      toast({ title: 'Missing Information', description: 'Please ensure resume text is available.', variant: 'destructive' });
      return;
    }
    setIsLoadingImprovements(true);
    try {
      const result = await suggestImprovements({ resumeText: currentResumeText, jobDescription: jobRole }); 
      setCurrentResumeText(result.improvedResumeText);
      setAiSuggestions(result.suggestions);
      toast({ title: 'Success', description: 'Resume improvements suggested in the text. Click "Apply Text Edits" to update your structured resume data and ATS score.' });
    } catch (error) {
      console.error('Error suggesting improvements:', error);
      toast({ title: 'Error', description: 'Failed to suggest improvements.', variant: 'destructive' });
    } finally {
      setIsLoadingImprovements(false);
    }
  };
  
  const handleApplyTextEdits = async () => {
    if (!currentResumeText) {
      toast({ title: 'No Text to Apply', description: 'Resume text is empty.', variant: 'destructive' });
      return;
    }
    setIsLoadingReparse(true);
    try {
      const extractedData = await extractResumeData({ resumeText: currentResumeText });
      const processedExtractedData = {
        ...extractedData,
        workExperience: extractedData.workExperience.map(exp => ({
          ...exp,
          isCurrent: !exp.endDate || exp.endDate.toLowerCase() === 'present',
          endDate: (!exp.endDate || exp.endDate.toLowerCase() === 'present') ? 'Present' : exp.endDate,
        })),
      };
      setResumeData(processedExtractedData); // This will trigger useEffect to update ATS score and currentResumeText
      toast({ title: 'Success', description: 'Text edits applied to resume data. ATS score updated.' });
    } catch (error) {
      console.error('Error applying text edits to resume data:', error);
      toast({ title: 'Error Applying Edits', description: 'Failed to re-parse edited text. Ensure the text maintains a clear resume structure.', variant: 'destructive' });
    } finally {
      setIsLoadingReparse(false);
    }
  };


  const handleExportPdf = async () => {
    if (!resumePreviewRef.current || !resumeData || !selectedTemplate) {
      toast({ title: "Nothing to export", description: "Please ensure resume data is loaded and a template is selected.", variant: "destructive" });
      return;
    }
    setIsExportingPdf(true);
    try {
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        windowWidth: resumePreviewRef.current.scrollWidth,
        windowHeight: resumePreviewRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4' 
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps= pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const newImgWidth = imgWidth * ratio;
      const newImgHeight = imgHeight * ratio;

      const xOffset = (pdfWidth - newImgWidth) / 2;
      const yOffset = 0; 

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
      pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_${selectedTemplate.id}.pdf`);
      toast({ title: 'Success', description: 'Your resume has been downloaded as a PDF.' });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: 'Error', description: 'Failed to generate PDF. Check console for details.', variant: 'destructive' });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const SelectedTemplateComponent = selectedTemplate?.component;

  const DatePickerField = ({ value, onChange, disabled }: { value?: string, onChange: (date: Date | undefined) => void, disabled?: boolean }) => {
    const selectedDate = value && value !== 'Present' && value !== '' ? parse(value, 'yyyy-MM', new Date()) : undefined;
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`w-full justify-start text-left font-normal ${!value || value === 'Present' || value === '' ? "text-muted-foreground" : ""}`}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value && value !== 'Present' && value !== '' ? format(selectedDate || new Date(), "MMM yyyy") : (disabled && value === 'Present' ? "Present" : <span>Pick a date</span>)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => onChange(date)}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1970}
            toYear={new Date().getFullYear() + 5}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    );
  };


  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-primary-foreground">
          <TabsTrigger value="upload">1. Input Resume</TabsTrigger>
          <TabsTrigger value="enhance" disabled={!resumeData}>2. AI Enhance & Edit</TabsTrigger>
          <TabsTrigger value="export" disabled={!resumeData}>3. Template & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline"><FileSignature className="mr-2 h-6 w-6 text-primary" />Provide Your Resume Details</CardTitle>
              <CardDescription>Choose your preferred method: upload an existing resume or fill out the form below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup defaultValue="file" value={inputMode} onValueChange={(value: 'file' | 'form') => setInputMode(value)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="r-file" />
                  <Label htmlFor="r-file">Upload Resume File (PDF/DOCX)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="form" id="r-form" />
                  <Label htmlFor="r-form">Fill Form Manually</Label>
                </div>
              </RadioGroup>

              {inputMode === 'file' && (
                <div>
                  <Input type="file" accept=".pdf,.docx" onChange={handleFileUpload} disabled={isLoadingExtract || isLoadingAtsScore} className="border-primary focus:ring-primary" />
                  {(isLoadingExtract) && (
                    <div className="flex items-center text-primary mt-2">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                       Processing your resume...
                    </div>
                  )}
                </div>
              )}

              {inputMode === 'form' && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobRoleForSuggestions">Target Job Role (for AI Suggestions)</Label>
                    <Input 
                      id="jobRoleForSuggestions" 
                      value={jobRoleForSuggestions} 
                      onChange={(e) => setJobRoleForSuggestions(e.target.value)} 
                      placeholder="e.g., Senior Software Engineer" 
                    />
                    <CardDescription className="text-xs">Providing a job role helps AI generate more relevant suggestions for the fields below.</CardDescription>
                  </div>

                  <Card>
                    <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label htmlFor="form-name">Full Name</Label><Input id="form-name" value={manualFormData.name} onChange={(e) => handleManualFormChange('name', e.target.value)} required /></div>
                      <div><Label htmlFor="form-email">Email</Label><Input id="form-email" type="email" value={manualFormData.contactInfo.email} onChange={(e) => handleManualFormChange('contactInfo', e.target.value, 'email')} required /></div>
                      <div><Label htmlFor="form-phone">Phone</Label><Input id="form-phone" type="tel" value={manualFormData.contactInfo.phone} onChange={(e) => handleManualFormChange('contactInfo', e.target.value, 'phone')} required /></div>
                      <div><Label htmlFor="form-linkedin">LinkedIn Profile URL (Optional)</Label><Input id="form-linkedin" value={manualFormData.contactInfo.linkedin || ''} onChange={(e) => handleManualFormChange('contactInfo', e.target.value, 'linkedin')} /></div>
                      <div><Label htmlFor="form-github">GitHub Profile URL (Optional)</Label><Input id="form-github" value={manualFormData.contactInfo.github || ''} onChange={(e) => handleManualFormChange('contactInfo', e.target.value, 'github')} /></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-2">
                       <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="form-summary" className="text-lg font-semibold">Summary / Objective</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAiSuggestContent('summary')}
                          disabled={!jobRoleForSuggestions || isSuggestingFor === 'summary'}
                          className="text-xs"
                        >
                          {isSuggestingFor === 'summary' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                          AI Suggest
                        </Button>
                      </div>
                      <Textarea id="form-summary" placeholder="Write a brief summary about yourself..." value={manualFormData.summary} onChange={(e) => handleManualFormChange('summary', e.target.value)} rows={4} required />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="form-skills" className="text-lg font-semibold">Skills</Label>
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAiSuggestContent('skills')}
                            disabled={!jobRoleForSuggestions || isSuggestingFor === 'skills'}
                            className="text-xs"
                          >
                            {isSuggestingFor === 'skills' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                            AI Suggest
                          </Button>
                       </div>
                       <Textarea id="form-skills" placeholder="Enter skills, comma-separated (e.g., React, Node.js, Project Management)" value={skillsInput} onChange={handleSkillsInputChange} onBlur={parseSkillsInput} rows={3} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Work Experience</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => addItem('workExperience')}><PlusCircle className="mr-2 h-4 w-4" />Add Experience</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {manualFormData.workExperience.map((exp, index) => (
                        <Card key={index} className="p-4 relative">
                           <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:text-destructive/80" onClick={() => removeItem('workExperience', index)}><XCircle className="h-5 w-5" /></Button>
                          <div className="space-y-2">
                            <div><Label htmlFor={`exp-title-${index}`}>Job Title</Label><Input id={`exp-title-${index}`} value={exp.title} onChange={(e) => handleManualFormChange('workExperience', e.target.value, 'title', index)} required/></div>
                            <div><Label htmlFor={`exp-company-${index}`}>Company</Label><Input id={`exp-company-${index}`} value={exp.company} onChange={(e) => handleManualFormChange('workExperience', e.target.value, 'company', index)} required/></div>
                            <div className="flex items-center space-x-2 my-2">
                                <Checkbox 
                                    id={`exp-current-${index}`} 
                                    checked={!!exp.isCurrent}
                                    onCheckedChange={(checked) => handleManualFormChange('workExperience.isCurrent', checked, undefined, index)}
                                />
                                <Label htmlFor={`exp-current-${index}`}>I currently work here</Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                                <DatePickerField
                                  value={exp.startDate}
                                  onChange={(date) => handleManualFormChange('workExperience', date ? format(date, 'yyyy-MM') : '', 'startDate', index)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                                 <DatePickerField
                                  value={exp.isCurrent ? 'Present' : exp.endDate}
                                  onChange={(date) => {
                                    if (exp.isCurrent) return; 
                                    handleManualFormChange('workExperience', date ? format(date, 'yyyy-MM') : '', 'endDate', index)
                                  }}
                                  disabled={!!exp.isCurrent}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1 mt-2">
                                <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                                <Button
                                  type="button" variant="outline" size="sm"
                                  onClick={() => handleAiSuggestContent('experienceDescription', index, { jobTitle: exp.title, companyName: exp.company })}
                                  disabled={!jobRoleForSuggestions || isSuggestingFor === `experienceDescription-${index}`}
                                  className="text-xs"
                                >
                                  {isSuggestingFor === `experienceDescription-${index}` ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                                  AI Suggest
                                </Button>
                              </div>
                              <Textarea id={`exp-desc-${index}`} value={exp.description} onChange={(e) => handleManualFormChange('workExperience', e.target.value, 'description', index)} rows={3} required/>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {manualFormData.workExperience.length === 0 && <p className="text-sm text-muted-foreground">No work experience added yet.</p>}
                    </CardContent>
                  </Card>
                  
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Education</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => addItem('education')}><PlusCircle className="mr-2 h-4 w-4" />Add Education</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {manualFormData.education.map((edu, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:text-destructive/80" onClick={() => removeItem('education', index)}><XCircle className="h-5 w-5" /></Button>
                          <div className="space-y-2">
                            <div><Label htmlFor={`edu-degree-${index}`}>Degree/Certificate</Label><Input id={`edu-degree-${index}`} value={edu.degree} onChange={(e) => handleManualFormChange('education', e.target.value, 'degree', index)} required/></div>
                            <div><Label htmlFor={`edu-institution-${index}`}>Institution</Label><Input id={`edu-institution-${index}`} value={edu.institution} onChange={(e) => handleManualFormChange('education', e.target.value, 'institution', index)} required/></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                                 <DatePickerField
                                  value={edu.startDate}
                                  onChange={(date) => handleManualFormChange('education', date ? format(date, 'yyyy-MM') : '', 'startDate', index)}
                                />
                               </div>
                               <div>
                                <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                                <DatePickerField
                                  value={edu.endDate}
                                  onChange={(date) => handleManualFormChange('education', date ? format(date, 'yyyy-MM') : '', 'endDate', index)}
                                />
                               </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {manualFormData.education.length === 0 && <p className="text-sm text-muted-foreground">No education added yet.</p>}
                    </CardContent>
                  </Card>

                   <Card>
                     <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Projects (Optional)</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => addItem('projects')}><PlusCircle className="mr-2 h-4 w-4" />Add Project</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {manualFormData.projects.map((proj, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:text-destructive/80" onClick={() => removeItem('projects', index)}><XCircle className="h-5 w-5" /></Button>
                          <div className="space-y-2">
                            <div><Label htmlFor={`proj-name-${index}`}>Project Name</Label><Input id={`proj-name-${index}`} value={proj.name} onChange={(e) => handleManualFormChange('projects', e.target.value, 'name', index)} /></div>
                            <div>
                              <div className="flex items-center justify-between mb-1 mt-2">
                                <Label htmlFor={`proj-desc-${index}`}>Description</Label>
                                <Button
                                  type="button" variant="outline" size="sm"
                                  onClick={() => handleAiSuggestContent('projectDescription', index, { projectName: proj.name })}
                                  disabled={!jobRoleForSuggestions || isSuggestingFor === `projectDescription-${index}`}
                                  className="text-xs"
                                >
                                  {isSuggestingFor === `projectDescription-${index}` ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                                  AI Suggest
                                </Button>
                              </div>
                              <Textarea id={`proj-desc-${index}`} value={proj.description} onChange={(e) => handleManualFormChange('projects', e.target.value, 'description', index)} rows={3}/>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {manualFormData.projects.length === 0 && <p className="text-sm text-muted-foreground">No projects added yet.</p>}
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full" disabled={isLoadingExtract || isLoadingAtsScore}>
                    {(isLoadingExtract || isLoadingAtsScore) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
                    Submit & Analyze Form
                  </Button>
                </form>
              )}

              {(resumeData || isLoadingExtract || isLoadingAtsScore) && inputMode === 'file' && !isLoadingExtract && ( 
                 <Card className="mt-4 bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Extracted Information Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        {resumeData && (<>
                            <p><strong>Name:</strong> {resumeData.name}</p>
                            <p><strong>Email:</strong> {resumeData.contactInfo.email}</p>
                            <p><strong>Phone:</strong> {resumeData.contactInfo.phone}</p>
                            <p><strong>Summary:</strong> {resumeData.summary.substring(0,100)}...</p>
                            <p><strong>Skills:</strong> {resumeData.skills.slice(0,5).join(', ')}...</p>
                        </>)}
                        {atsScore !== null && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center mb-2">
                               <Target className="mr-2 h-5 w-5 text-accent" />
                               <CardTitle className="text-md">Initial ATS Score: {atsScore}/100</CardTitle>
                            </div>
                            <Progress value={atsScore} className="w-full h-3 mb-2" />
                            {atsScoreJustification && <CardDescription className="text-xs">{atsScoreJustification}</CardDescription>}
                          </div>
                        )}
                         {isLoadingAtsScore && !atsScore && (
                            <div className="flex items-center text-accent mt-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Calculating ATS score...
                            </div>
                        )}
                    </CardContent>
                    {resumeData && (
                      <CardFooter>
                          <Button onClick={() => setActiveTab("enhance")} disabled={isLoadingAtsScore || !resumeData}>Proceed to Enhance</Button>
                      </CardFooter>
                    )}
                 </Card>
              )}
               {(resumeData || isLoadingExtract || isLoadingAtsScore) && inputMode === 'form' && resumeData && !isLoadingExtract && (
                 <Card className="mt-4 bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Submitted Information Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p><strong>Name:</strong> {resumeData.name}</p>
                        <p><strong>Email:</strong> {resumeData.contactInfo.email}</p>
                         {atsScore !== null && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center mb-2">
                               <Target className="mr-2 h-5 w-5 text-accent" />
                               <CardTitle className="text-md">Initial ATS Score: {atsScore}/100</CardTitle>
                            </div>
                            <Progress value={atsScore} className="w-full h-3 mb-2" />
                            {atsScoreJustification && <CardDescription className="text-xs">{atsScoreJustification}</CardDescription>}
                          </div>
                        )}
                         {isLoadingAtsScore && !atsScore && (
                            <div className="flex items-center text-accent mt-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Calculating ATS score...
                            </div>
                        )}
                    </CardContent>
                     <CardFooter>
                        <Button onClick={() => setActiveTab("enhance")} disabled={isLoadingAtsScore || !resumeData}>Proceed to Enhance</Button>
                    </CardFooter>
                 </Card>
               )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhance" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline"><Sparkles className="mr-2 h-6 w-6 text-accent" />AI Enhancement & Text Edit</CardTitle>
              <CardDescription>Refine resume text with AI (keywords, improvements). Edits here apply to the text below. To update your structured resume data and ATS score from these text changes, click "Apply Text Edits".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="jobRoleEnhance" className="block text-sm font-medium text-foreground mb-1">Target Job Role (for AI Keyword/Improvement)</label>
                <Input
                  id="jobRoleEnhance"
                  type="text"
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={jobRole} 
                  onChange={(e) => setJobRole(e.target.value)}
                  className="border-accent focus:ring-accent"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddAtsKeywords} disabled={isLoadingKeywords || !jobRole || !currentResumeText} className="bg-accent hover:bg-accent/90">
                  {isLoadingKeywords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Add ATS Keywords (to text below)
                </Button>
                <Button onClick={handleSuggestImprovements} disabled={isLoadingImprovements || !currentResumeText} variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                  {isLoadingImprovements ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                  Suggest Improvements (to text below)
                </Button>
              </div>
              {aiSuggestions.length > 0 && (
                <Card className="bg-background/50">
                  <CardHeader><CardTitle className="text-md">AI Suggestions for Improvement</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              <div>
                <label htmlFor="resumeText" className="block text-sm font-medium text-foreground mb-1">Current Resume Text (Editable)</label>
                <Textarea
                  id="resumeText"
                  value={currentResumeText}
                  onChange={(e) => setCurrentResumeText(e.target.value)}
                  rows={15}
                  placeholder="Your resume text will appear here. Edit it or use AI tools, then click 'Apply Text Edits' to update your main resume data."
                  className="border-gray-300 focus:ring-primary"
                />
                 <CardDescription className="text-xs mt-1">
                   Manual edits or AI enhancements applied here modify this text block. 
                   To reflect these changes in your final resume (templates, PDF, ATS score), click the "Apply Text Edits & Update Resume Data" button below.
                   This will re-parse the text and update your structured resume data.
                 </CardDescription>
              </div>
               <Button onClick={handleApplyTextEdits} disabled={isLoadingReparse || !currentResumeText || isLoadingAtsScore} className="w-full">
                {isLoadingReparse ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Apply Text Edits & Update Resume Data
              </Button>
               {atsScore !== null && (
                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                        <Target className="mr-2 h-5 w-5 text-accent" />
                        <CardTitle className="text-md">Current ATS Score: {atsScore}/100</CardTitle>
                    </div>
                    <Progress value={atsScore} className="w-full h-3 mb-2" />
                    {atsScoreJustification && <CardDescription className="text-xs">{atsScoreJustification}</CardDescription>}
                </div>
              )}
              {isLoadingAtsScore && (
                <div className="flex items-center text-accent mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating ATS score...
                </div>
              )}
            </CardContent>
             <CardFooter>
                <Button onClick={() => setActiveTab("export")} disabled={!resumeData}>Proceed to Template & Export</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-headline"><Palette className="mr-2 h-6 w-6 text-primary" />Select a Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Select 
                    onValueChange={(templateId) => {
                        const newSelectedTemplate = availableTemplates.find(t => t.id === templateId);
                        if (newSelectedTemplate) setSelectedTemplate(newSelectedTemplate);
                    }} 
                    value={selectedTemplate?.id || ""}
                   >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                            {template.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                   </Select>
                </CardContent>
              </Card>
               <Button onClick={handleExportPdf} className="w-full" disabled={!resumeData || !selectedTemplate || isExportingPdf}>
                {isExportingPdf ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                {isExportingPdf ? 'Generating PDF...' : 'Download Resume (PDF)'}
              </Button>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-headline"><FileText className="mr-2 h-6 w-6 text-primary"/>Resume Preview</CardTitle>
                  <CardDescription>This is a live preview. Your downloaded PDF will match this styling.</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100vh-220px)] overflow-hidden">
                  <div 
                    ref={resumePreviewRef} 
                    id="resume-preview-content" 
                    className="border rounded-md bg-white shadow overflow-y-auto h-full"
                  >
                    {SelectedTemplateComponent && resumeData ? (
                      <SelectedTemplateComponent resumeData={resumeData} />
                    ) : (
                      <div className="p-8 text-center text-muted-foreground flex items-center justify-center h-full">
                        {resumeData ? "Select a template to see the preview." : "Provide your resume data and select a template to see the preview."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
