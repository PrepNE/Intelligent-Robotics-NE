import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { generatePageTitle } from "../lib/utils";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    let newGreeting = "";
    
    if (hours < 12) {
      newGreeting = "Good morning";
    } else if (hours < 18) {
      newGreeting = "Good afternoon";
    } else {
      newGreeting = "Good evening";
    }
    
    setGreeting(newGreeting);
  }, []);

  return (
    <>
      <Helmet>
        <title>{generatePageTitle("Welcome")}</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">

        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-white font-bold text-xl">KPA</div>
            {user && (
              <div className="text-white flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
                  {user.firstName[0]}
                </div>
                <span className="hidden sm:inline">{user.firstName}</span>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-lg w-full">
            <div className="text-center space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              
     
              <div>
                <p className="text-blue-600 font-semibold">{greeting}!</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Welcome to our platform
                </h1>
              </div>
              
    
              <p className="text-gray-600 max-w-md mx-auto">
                {user
                  ? `You're logged in as ${user.firstName} ${user.lastName}. Access your personalized dashboard to get started.`
                  : "Join our community to access exclusive features and personalized content. It only takes a minute to get started."}
              </p>
              

              {user ? (
                <Link to="/dashboard">
                  <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center w-full sm:w-auto mx-auto">
                    Go to Dashboard
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login" className="w-full sm:w-auto">
                    <button className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register" className="w-full sm:w-auto">
                    <button className="w-full px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-300">
                      Create Account
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
    
            {!user && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-blue-600 mb-2">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Secure Access</h3>
                  <p className="text-gray-600 text-sm mt-1">Bank-level security protocols to keep your data safe</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-blue-600 mb-2">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm mt-1">Optimized performance for quick and responsive experience</p>
                </div>
              </div>
            )}
          </div>
        </main>
    
        <footer className="bg-gray-50 py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} KPA. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}