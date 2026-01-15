'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto animate-slideDown z-50">
        <div className="text-2xl font-bold tracking-tighter select-none" style={{ fontFamily: 'var(--font-display)' }}>
          KINETIC<span className="text-[var(--color-electric)]">.</span>DO
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link href="/tasks" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary px-6 py-2 bg-white/50 backdrop-blur-sm hover:bg-white">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 pt-10 pb-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[var(--color-electric-light)] rounded-full blur-[100px] opacity-40 -z-10 animate-pulse pointer-events-none" />
        
        <div className="max-w-5xl mx-auto z-10 flex flex-col items-center">
          <div className="mb-8 inline-block animate-slideUp opacity-0" style={{ animationFillMode: 'forwards' }}>
             <span className="badge badge-electric text-sm py-1.5 px-4 shadow-sm border border-[var(--color-electric-light)] bg-white/80 backdrop-blur-sm">v2.0 Now Available</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight animate-slideUp opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
            Organize with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-electric)] via-[var(--color-electric-dark)] to-[var(--color-navy)]">
              Kinetic Precision
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-gray)] mb-12 max-w-2xl mx-auto leading-relaxed animate-slideUp opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
            Experience the next generation of task management. Fast, fluid, and designed for flow state. Stop managing, start doing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp opacity-0 delay-300 w-full" style={{ animationFillMode: 'forwards' }}>
            <Link href={isAuthenticated ? "/tasks" : "/login"} className="btn-primary min-w-[180px] text-lg shadow-xl shadow-blue-500/20">
              {isAuthenticated ? "Go to Tasks" : "Get Started Free"}
            </Link>
            <button className="btn-secondary min-w-[180px] text-lg bg-white/50 backdrop-blur-sm hover:bg-white">
              View Features
            </button>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="mt-24 w-full max-w-4xl relative animate-floatIn opacity-0 delay-400 mx-auto hidden md:block" style={{ animationFillMode: 'forwards' }}>
          
          {/* Main Interface Mockup */}
          <div className="relative rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 p-2 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-2xl -z-10" />
             
             {/* Window Controls */}
             <div className="h-10 border-b border-black/5 flex items-center px-4 gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
             </div>

             {/* Mock Content */}
             <div className="bg-white/70 rounded-xl p-8 min-h-[400px] flex gap-8">
                {/* Sidebar Mock */}
                <div className="w-1/4 border-r border-black/5 pr-6 space-y-4">
                    <div className="h-8 w-3/4 bg-gray-200/50 rounded-lg animate-pulse"></div>
                    <div className="space-y-2 pt-4">
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                        <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                </div>

                {/* Main Content Mock */}
                <div className="flex-1">
                    <div className="flex justify-between mb-8">
                        <div className="h-8 w-1/3 bg-gray-200/50 rounded-lg"></div>
                        <div className="h-8 w-24 bg-[var(--color-electric)] rounded-lg opacity-80"></div>
                    </div>

                    <div className="space-y-4">
                        {/* Task Card 1 */}
                        <div className="card bg-white p-4 flex items-center gap-4 hover:translate-y-0 cursor-default">
                           <div className="w-6 h-6 rounded border-2 border-[var(--color-lime)] flex items-center justify-center bg-[var(--color-lime)] text-white text-xs">✓</div>
                           <div className="flex-1">
                              <div className="font-semibold text-gray-400 line-through">Review Design System</div>
                           </div>
                           <span className="badge badge-lime opacity-50">Done</span>
                        </div>

                        {/* Task Card 2 */}
                        <div className="card bg-white p-4 flex items-center gap-4 transform -translate-y-1 shadow-lg border-[var(--color-electric-light)]">
                           <div className="w-6 h-6 rounded border-2 border-gray-300"></div>
                           <div className="flex-1">
                              <div className="font-semibold">Implement Landing Page</div>
                              <div className="text-xs text-gray-400 mt-1">High priority • Due Today</div>
                           </div>
                           <span className="badge badge-electric">In Progress</span>
                        </div>

                         {/* Task Card 3 */}
                         <div className="card bg-white/50 p-4 flex items-center gap-4 border-dashed border-2 border-gray-200 shadow-none">
                           <div className="w-6 h-6 rounded border-2 border-gray-200"></div>
                           <div className="flex-1">
                              <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                           </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Floating Element: Success Toast */}
          <div className="absolute -right-8 top-20 card p-4 w-64 bg-white shadow-xl animate-slideUp" style={{ animationDelay: '1.5s', animationFillMode: 'backwards' }}>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[var(--color-lime)] flex items-center justify-center text-white text-sm">✓</div>
               <div>
                  <div className="text-sm font-bold">Task Completed</div>
                  <div className="text-xs text-gray-500">Just now</div>
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--color-gray)] relative z-10">
        <div className="flex justify-center gap-6 mb-4">
           <a href="#" className="hover:text-[var(--color-electric)] transition-colors">Twitter</a>
           <a href="#" className="hover:text-[var(--color-electric)] transition-colors">GitHub</a>
           <a href="#" className="hover:text-[var(--color-electric)] transition-colors">Discord</a>
        </div>
        <p>© 2026 Kinetic Do. All rights reserved.</p>
      </footer>
    </div>
  );
}