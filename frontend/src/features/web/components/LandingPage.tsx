import WebNavbar from "@/components/shared/WebNavbar";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  Mail,
  Clock,
  ShieldCheck,
  ArrowRight,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Smart Contact Management",
    desc: "Organize, segment & track customer contacts in one place.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Analytics & Insights",
    desc: "Track performance and close rates with real-time data.",
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: "Teams",
    desc: "Effortlessly add and organize team members to collaborate and manage work seamlessly.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Tasks & Reminders",
    desc: "Stay on top of deals with prioritized daily work queues.",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Lead Management",
    desc: "Organize, segment & track leads in one place.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure & Compliant",
    desc: "Enterprise-grade security baked in from day one.",
  },
];

const stats = [
  { value: "4x", label: "Faster onboarding" },
  { value: "+32%", label: "Avg. close rate lift" },
  { value: "<5m", label: "Setup time" },
  { value: "99.99%", label: "Uptime SLA" },
];

function LandingPage() {
  return (
    <>
      <WebNavbar />
      <div className="relative overflow-hidden">
        {/* Background gradients / ornaments */}
        <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl animate-pulse [animation-delay:300ms]" />
        </div>
        {/* Hero */}
        <section className="w-full pt-28 pb-24 text-center px-4 md:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500" />{" "}
            <span>Ship faster with LambdaCRM</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-balance text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            The lightweight, powerful CRM built for modern teams
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mt-6 text-muted-foreground">
            Close more deals, automate the grunt work, and get clarity on
            pipeline health — without enterprise bloat.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app/organizations">
              <Button size="lg" className="h-12 px-8 text-base gap-2 group">
                Get Started{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                Explore Features
              </Button>
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg border border-border/60 bg-card/50 backdrop-blur px-4 py-5 shadow-sm"
              >
                <span className="text-2xl md:text-3xl font-semibold text-foreground">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground tracking-wide uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-24 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">
            A focused toolkit to manage relationships, accelerate deals, and
            surface the signals that matter.
          </p>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="relative group overflow-hidden border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
                <CardContent className="relative flex flex-col gap-4 p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-blue-500/10 ring-1 ring-inset ring-blue-500/30 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 bg-card/40 px-4 md:px-8 backdrop-blur">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white p-10 md:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Ready to accelerate revenue?
              </h2>
              <p className="text-white/80 max-w-2xl mb-8 text-lg">
                Start free today. No credit card. Get a workspace your team
                actually enjoys using.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/app/organizations">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base font-medium"
                  >
                    Create Workspace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-10 text-center border-t border-border/60">
          <p className="mb-2 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LambdaCRM. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built with ❤️ by  <a target="_blank" href="https://github.com/ubaidrmn">@ubaidrmn</a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
