import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Clock, Home, Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const navLinks = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/history", label: "History", icon: Clock, exact: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.brand_link"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-card">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-semibold text-lg text-foreground tracking-tight">
                Lecture
              </span>
              <span className="font-display font-semibold text-lg text-primary">
                AI
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-accent opacity-70 group-hover:opacity-100 transition-smooth" />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label, icon: Icon, exact }) => {
              const isActive = exact
                ? pathname === to
                : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`nav.${label.toLowerCase()}_link`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded gradient-primary flex items-center justify-center">
              <BookOpen className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <span>LectureAI — your AI-powered study companion</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
