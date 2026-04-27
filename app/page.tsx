import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { Shield, Zap, BarChart3, Search } from "lucide-react";
import { redirect } from "next/navigation";
import Chatbot from "@/components/Chatbot";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-64px)] relative">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Intelligent Complaint Management
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Automatically analyze sentiment, prioritize issues, and organize customer feedback with our AI-powered analyzer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="#">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/complaints/new">Submit a Complaint</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why AI Analyzer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Zap className="h-10 w-10 text-yellow-500" />}
                title="Instant AI Analysis"
                description="Get immediate sentiment and priority scores for every complaint."
              />
              <FeatureCard 
                icon={<Search className="h-10 w-10 text-blue-500" />}
                title="Smart Categorization"
                description="Our AI automatically categorizes complaints to the right department."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-10 w-10 text-green-500" />}
                title="Real-time Insights"
                description="Visual dashboards to track pending vs resolved issues at a glance."
              />
              <FeatureCard 
                icon={<Shield className="h-10 w-10 text-purple-500" />}
                title="Secure & Reliable"
                description="Built with enterprise-grade security and data validation."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to make a difference?</h2>
              <p className="text-muted-foreground">
                Join hundreds of companies using our platform to build better customer relationships.
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link href="/login">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Chatbot />
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
