
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, UploadCloud, Brain, FileText, Palette, Target } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Resume Builder | ATS-Optimized Templates | Resumintic',
  description: 'Build your job-winning resume with Resumintic, the free AI resume builder. Get ATS-friendly templates, AI suggestions, and keyword optimization to land your dream job.',
};

export default function HomePage() {
  const features = [
    {
      icon: <UploadCloud className="h-10 w-10 text-primary" />,
      title: "Easy Resume Upload & Parsing",
      description: "Instantly upload your PDF or DOCX resume. Our AI extracts your information, or fill out our intuitive form.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI-Powered Resume Enhancement",
      description: "Leverage AI to get tailored suggestions, ATS-friendly keywords, and improve your resume's overall impact for any job role.",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Professional & ATS-Friendly Templates",
      description: "Choose from a variety of professionally designed, ATS-friendly resume templates, ensuring your resume stands out.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Instant PDF Resume Export",
      description: "Download your polished, professional resume as a high-quality PDF, ready to impress employers and conquer applicant tracking systems.",
    },
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-12 py-8">
      <section className="max-w-3xl">
        <h1 className="text-5xl font-headline font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
          Craft Your ATS-Friendly Resume with Our <span className="text-accent">AI Resume Builder</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
          Welcome to Resumintic, your partner in starting a new career journey. Create a professional, ATS-friendly resume in minutes. Our AI-powered platform helps you highlight your skills and experience, tailored to your dream job. Get started for free!
        </p>
        <div className="mt-10">
          <Button size="lg" asChild>
            <Link href="/build">
              Create Your Free Resume Now
              <CheckCircle className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-3xl font-headline font-bold text-foreground mb-8">Why Choose Resumintic AI Resume Creator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="w-full max-w-5xl">
         <Image src="https://placehold.co/1200x400.png" alt="Examples of ATS-friendly resumes created with Resumintic AI resume builder" width={1200} height={400} className="rounded-lg shadow-xl" data-ai-hint="resume examples" />
      </section>

      <section className="w-full max-w-3xl mt-12 py-8">
        <h2 className="text-3xl font-headline font-bold text-foreground mb-4">Boost Your Job Search with an AI-Optimized Resume</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Navigating today's job market requires a resume that not only impresses hiring managers but also passes through Applicant Tracking Systems (ATS). Resumintic's AI analyzes your profile and job descriptions to suggest impactful keywords and phrasing, ensuring your resume gets noticed. Choose from our best resume templates for jobs in 2025 and beyond.
        </p>
        <Button variant="secondary" size="lg" asChild>
            <Link href="/build">
              Start Building Your AI Resume
              <Target className="ml-2 h-5 w-5" />
            </Link>
        </Button>
      </section>
    </div>
  );
}
