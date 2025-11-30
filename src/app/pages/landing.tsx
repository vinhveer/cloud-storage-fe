import { Link } from '@tanstack/react-router'
import { Button } from '@/components/Button/Button'

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 sm:text-base lg:text-sm xl:text-base">
                Cloud Storage
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl text-gray-900 dark:text-white">
                <span className="block">Store, share</span>
                <span className="block text-blue-600 dark:text-blue-400">and manage files</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Secure, convenient, and easy-to-use cloud storage solution for all your needs. Access your data anytime, anywhere.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/login">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Login now
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign up for free
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                No credit card required. 15GB free storage.
              </p>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            {/* Placeholder for hero image or illustration if needed, for now keeping it clean or adding a subtle visual element */}
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <svg className="h-24 w-24 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

