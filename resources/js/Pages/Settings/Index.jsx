import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Cog6ToothIcon, BellIcon, EnvelopeIcon, MoonIcon, SunIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SettingsIndex({ auth, settings }) {
  const [currentSettings, setCurrentSettings] = useState(settings);

  const handleSettingChange = (key, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingItems = [
    {
      key: 'notifications',
      title: 'Push Notifications',
      description: 'Receive notifications for study reminders and updates',
      icon: BellIcon,
      type: 'toggle'
    },
    {
      key: 'email_alerts',
      title: 'Email Alerts',
      description: 'Get email notifications for important updates',
      icon: EnvelopeIcon,
      type: 'toggle'
    },
    {
      key: 'dark_mode',
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      icon: MoonIcon,
      type: 'toggle'
    },
    {
      key: 'auto_save',
      title: 'Auto Save',
      description: 'Automatically save your work as you type',
      icon: ShieldCheckIcon,
      type: 'toggle'
    },
    {
      key: 'study_reminders',
      title: 'Study Reminders',
      description: 'Receive reminders for scheduled study sessions',
      icon: BellIcon,
      type: 'toggle'
    }
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Settings</h2>}
    >
      <Head title="Settings" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <Cog6ToothIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">Customize your learning experience</p>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="space-y-8">
                {/* Notifications Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-4">
                    {settingItems.slice(0, 2).map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentSettings[item.key]}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Appearance Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
                  <div className="space-y-4">
                    {settingItems.slice(2, 3).map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentSettings[item.key]}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Study Preferences Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Study Preferences</h2>
                  <div className="space-y-4">
                    {settingItems.slice(3).map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentSettings[item.key]}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Account Settings */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Profile Information</h3>
                          <p className="text-sm text-gray-600">Update your name, email, and profile picture</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Change Password</h3>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Change Password
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Data Export</h3>
                          <p className="text-sm text-gray-600">Download your data and study history</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 