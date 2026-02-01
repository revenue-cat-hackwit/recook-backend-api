// @/app/page.tsx

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Brand Color */}
          <div className="bg-gradient-to-br from-[#8BD65E] to-[#6FB84A] px-8 py-12 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h1 className="text-white text-4xl font-normal tracking-tight mb-3">
              ReCook API
            </h1>
            <p className="text-white text-lg font-normal opacity-95">
              Backend Service for Your Personalized Recipe Assistant
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-800 text-2xl font-normal mb-4">
                  Welcome to ReCook API
                </h2>
                <p className="text-gray-600 text-base font-normal leading-relaxed">
                  This is the backend API service powering the ReCook application. 
                  Access comprehensive endpoints for authentication, user management, 
                  and personalized recipe recommendations.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">🔐</div>
                  <h3 className="text-gray-700 text-base font-normal mb-2">
                    Authentication
                  </h3>
                  <p className="text-gray-500 text-sm font-normal">
                    JWT-based auth with email verification and password reset
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">👤</div>
                  <h3 className="text-gray-700 text-base font-normal mb-2">
                    User Management
                  </h3>
                  <p className="text-gray-500 text-sm font-normal">
                    Complete user profiles with avatar support
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">⚙️</div>
                  <h3 className="text-gray-700 text-base font-normal mb-2">
                    Personalization
                  </h3>
                  <p className="text-gray-500 text-sm font-normal">
                    Custom preferences for cuisines, allergies, and kitchen tools
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">🔌</div>
                  <h3 className="text-gray-700 text-base font-normal mb-2">
                    RESTful API
                  </h3>
                  <p className="text-gray-500 text-sm font-normal">
                    Clean, documented endpoints with JSON responses
                  </p>
                </div>
              </div>

              {/* API Info Box */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-[#8BD65E] rounded-lg p-5 mt-6">
                <p className="text-gray-700 text-sm font-normal leading-relaxed">
                  <span className="text-base">📚</span> API Documentation available at{' '}
                  <span className="text-[#6FB84A] font-normal">/docs/AUTH_README.md</span>
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-[#8BD65E] text-3xl font-normal mb-1">15+</div>
                  <div className="text-gray-500 text-xs font-normal">Endpoints</div>
                </div>
                <div className="text-center">
                  <div className="text-[#8BD65E] text-3xl font-normal mb-1">JWT</div>
                  <div className="text-gray-500 text-xs font-normal">Security</div>
                </div>
                <div className="text-center">
                  <div className="text-[#8BD65E] text-3xl font-normal mb-1">REST</div>
                  <div className="text-gray-500 text-xs font-normal">Architecture</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
            <p className="text-gray-400 text-xs font-normal">
              This is an automated API service. For support, contact the development team.
            </p>
            <p className="text-gray-400 text-xs font-normal mt-2">
              © {new Date().getFullYear()} ReCook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;