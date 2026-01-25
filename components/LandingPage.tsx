'use client'

import { ArrowRight, CheckCircle, Globe, FileText, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleStartAssessment = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/20 mx-auto mb-6">
                <Globe className="w-10 h-10 text-accent" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Canadian Immigration
              <span className="block text-accent mt-2">Points Assessment</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover your eligibility for British Columbia and Nova Scotia immigration programs. 
              Get your personalized assessment in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={handleStartAssessment}
                className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="border-2 border-border hover:border-accent/50 text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Quick & Easy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Simple questionnaire that takes just a few minutes to complete. No complicated forms or paperwork.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Accurate Scoring</h3>
            <p className="text-muted-foreground leading-relaxed">
              Based on official program guidelines for British Columbia and Nova Scotia immigration programs.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <FileText className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Detailed Report</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive a comprehensive PDF summary of your assessment results via email.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Start Assessment', desc: 'Click the button to begin your personalized assessment' },
              { step: '02', title: 'Answer Questions', desc: 'Provide information about your education, work experience, and language skills' },
              { step: '03', title: 'Get Your Score', desc: 'Receive points calculated for both BC and NS programs' },
              { step: '04', title: 'Email Report', desc: 'Get a detailed PDF summary sent to your email' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the first step towards your Canadian immigration goals. Start your free assessment now.
          </p>
          <button
            onClick={handleStartAssessment}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>© 2026 Immigration Assessment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}