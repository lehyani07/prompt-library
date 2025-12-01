import React, { useState } from 'react'
import { 
  Home, 
  Users, 
  MessageSquare, 
  MoreHorizontal,
  Bell,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  X,
  FileText,
  Video,
  Info,
  User
} from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [materialsTab, setMaterialsTab] = useState('worksheets')
  const [showNotification, setShowNotification] = useState(true)

  return (
    <div className="min-h-screen bg-neutral-bgPage">
      {/* Top Navigation */}
      <nav className="bg-neutral-bgCard shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-base to-secondary-base rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="font-semibold text-lg">Creator</span>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-primary-base font-medium border-b-2 border-primary-base pb-1">
                  Home
                </a>
                <a href="#" className="text-neutral-textSecondary hover:text-neutral-textPrimary">
                  Find a Therapist
                </a>
                <a href="#" className="text-neutral-textSecondary hover:text-neutral-textPrimary flex items-center gap-1">
                  Messaging
                  <span className="bg-accent-error text-white text-xs px-1.5 py-0.5 rounded-pill">2</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-neutral-textSecondary hover:text-neutral-textPrimary">
                🌐 English
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-textSecondary">John Doe</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-base to-secondary-base flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Banner */}
        {showNotification && (
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-4 mb-6 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-base/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary-base" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">You have a new notification</h3>
                <p className="text-sm text-neutral-textSecondary">
                  Your appointment with Norma Murphy at 15:25 on 17 June has been rescheduled to 16:06 on 17 June.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="bg-primary-base text-white px-6 py-2 rounded-pill text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Sessions */}
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My sessions</h2>
              <ChevronRight className="w-5 h-5 text-neutral-iconMuted" />
            </div>

            <div className="flex gap-4 mb-4 border-b border-neutral-borderSubtle">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === 'upcoming'
                    ? 'text-primary-base'
                    : 'text-neutral-textSecondary hover:text-neutral-textPrimary'
                }`}
              >
                Upcoming
                {activeTab === 'upcoming' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-base rounded-pill" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === 'past'
                    ? 'text-primary-base'
                    : 'text-neutral-textSecondary hover:text-neutral-textPrimary'
                }`}
              >
                Past
                {activeTab === 'past' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-base rounded-pill" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <SessionItem
                date="17 Jun"
                time="15:10"
                name="Norma Murphy"
                type="In Person, 50 min"
                showActions
              />
              <SessionItem
                date="29 Jun"
                time="15:10"
                name="Cameron Williamson"
                type="Video call, 50 min"
              />
              <SessionItem
                date="26 Aug"
                time="15:10"
                name="Norma Murphy"
                type="Video call, 90 min"
              />
            </div>

            <button className="text-primary-base text-sm font-medium mt-4 hover:text-primary-hover">
              Show all
            </button>
          </div>

          {/* My Notes */}
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My notes</h2>
              <div className="flex items-center gap-2">
                <button className="text-accent-error text-sm hover:text-red-600">
                  Delete All
                </button>
                <button className="text-neutral-textSecondary text-sm hover:text-neutral-textPrimary flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download All
                </button>
                <button className="text-neutral-textSecondary hover:text-neutral-textPrimary">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <NoteItem
                date="21 July 2020"
                preview="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem..."
                status="Shared"
              />
              <NoteItem
                date="21 May 2020"
                preview="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem..."
                status="Shared"
                downloaded
              />
              <NoteItem
                date="28 Mar 2020"
                preview="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem..."
                status="Shared"
              />
            </div>

            <button className="text-primary-base text-sm font-medium mt-4 hover:text-primary-hover">
              Show all
            </button>
          </div>

          {/* My Materials */}
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My materials</h2>
              <ChevronRight className="w-5 h-5 text-neutral-iconMuted" />
            </div>

            <div className="flex gap-4 mb-4 border-b border-neutral-borderSubtle">
              {['worksheets', 'recordings', 'info'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMaterialsTab(tab)}
                  className={`pb-2 px-1 text-sm font-medium transition-colors relative capitalize ${
                    materialsTab === tab
                      ? 'text-primary-base'
                      : 'text-neutral-textSecondary hover:text-neutral-textPrimary'
                  }`}
                >
                  {tab}
                  {materialsTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-base rounded-pill" />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <MaterialItem name="Book.pdf" size="1.8 MB" />
              <MaterialItem name="Book.pdf" size="1.8 MB" />
              <MaterialItem name="Book.pdf" size="1.8 MB" />
            </div>

            <button className="text-primary-base text-sm font-medium mt-4 hover:text-primary-hover">
              Show all
            </button>
          </div>

          {/* My Goals & Journey */}
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My goals & journey</h2>
              <ChevronRight className="w-5 h-5 text-neutral-iconMuted" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-3xl font-bold mb-1">120</div>
                <div className="text-sm text-neutral-textSecondary">Attended sessions</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-1">14 Jun 2020</div>
                <div className="text-sm text-neutral-textSecondary">1st session</div>
              </div>
            </div>

            <div className="space-y-3">
              <GoalItem
                progress={75}
                text="I want to explore my past and make links with my life now"
              />
              <GoalItem
                progress={75}
                text="I want to work through something traumatic that..."
              />
            </div>

            <button className="text-primary-base text-sm font-medium mt-4 hover:text-primary-hover">
              Add
            </button>
          </div>

          {/* My Questionnaires */}
          <div className="bg-neutral-bgCard rounded-lg shadow-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My questionnaires</h2>
              <ChevronRight className="w-5 h-5 text-neutral-iconMuted" />
            </div>

            <div className="flex items-center gap-4 p-4 bg-neutral-bgSoft rounded-lg">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-base/20 to-secondary-base/20 border-2 border-white flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-base/20 to-primary-base/20 border-2 border-white flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-textSecondary">
                  Norma Murphy has sent you a questionnaire to complete.
                </p>
              </div>
              <button className="bg-primary-base text-white px-8 py-2.5 rounded-pill text-sm font-semibold hover:bg-primary-hover transition-colors shadow-button">
                Start
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Session Item Component
function SessionItem({ date, time, name, type, showActions }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-neutral-bgSoft rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-sm font-semibold">{date}</div>
          <div className="text-xs text-neutral-textSecondary">{time}</div>
        </div>
        <div className="w-px h-10 bg-neutral-borderSubtle" />
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-neutral-textSecondary">{type}</div>
        </div>
      </div>
      {showActions && (
        <div className="flex items-center gap-2">
          <button className="text-accent-error text-xs px-3 py-1.5 hover:bg-accent-error/10 rounded-md transition-colors">
            Cancel
          </button>
          <button className="text-primary-base text-xs px-3 py-1.5 hover:bg-primary-base/10 rounded-md transition-colors">
            Reschedule
          </button>
          <button className="bg-primary-base text-white text-xs px-4 py-1.5 rounded-pill hover:bg-primary-hover transition-colors">
            Start
          </button>
        </div>
      )}
    </div>
  )
}

// Note Item Component
function NoteItem({ date, preview, status, downloaded }) {
  return (
    <div className="p-3 border border-neutral-borderSubtle rounded-lg hover:border-primary-base/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{date}</span>
          <span className="text-xs px-2 py-0.5 bg-accent-success/10 text-accent-success rounded-pill">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {downloaded && (
            <span className="text-xs text-neutral-textSecondary">Downloaded</span>
          )}
          <button className="text-neutral-iconMuted hover:text-neutral-textPrimary">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-neutral-textSecondary line-clamp-2">{preview}</p>
      <button className="text-accent-error text-xs mt-2 hover:text-red-600">Delete</button>
    </div>
  )
}

// Material Item Component
function MaterialItem({ name, size }) {
  return (
    <div className="flex items-center justify-between p-3 border border-neutral-borderSubtle rounded-lg hover:border-primary-base/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-base/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-base" />
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-neutral-textSecondary">{size}</div>
        </div>
      </div>
      <button className="text-neutral-iconMuted hover:text-neutral-textPrimary">
        <Download className="w-5 h-5" />
      </button>
    </div>
  )
}

// Goal Item Component
function GoalItem({ progress, text }) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-neutral-bgSoft rounded-lg transition-colors">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#E1E4EC"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#2D8CFF"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold">{progress}%</span>
        </div>
      </div>
      <p className="text-sm text-neutral-textSecondary flex-1">{text}</p>
      <ChevronRight className="w-5 h-5 text-neutral-iconMuted flex-shrink-0" />
    </div>
  )
}

export default App

