import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div>
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Welcome Back!
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    Sign in to continue your learning journey
                </p>

                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <div className="relative mt-2">
                            <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-0 block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="you@example.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <div className="relative mt-2">
                            <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-0 block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    {/* Login Button */}
                    <PrimaryButton
                        className="w-full justify-center py-3 mt-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </PrimaryButton>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                New to QuizMaster?
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link
                        href={route('register')}
                        className="block text-center w-full py-2 px-4 border-2 border-purple-200 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        Create an Account
                    </Link>

                    {/* Forgot Password Link */}
                    {canResetPassword && (
                        <div className="text-center">
                            <Link
                                href={route('password.request')}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}
                </form>

                {/* Help Text */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </GuestLayout>
    );
}
