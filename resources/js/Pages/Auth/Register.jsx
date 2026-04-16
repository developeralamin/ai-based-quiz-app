import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div>
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Join QuizMaster
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    Start your intelligent learning journey today
                </p>

                <form onSubmit={submit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" />
                        <div className="relative mt-2">
                            <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-0 block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="John Doe"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                placeholder="Enter a strong password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">
                            At least 8 characters with uppercase, lowercase, and numbers
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />
                        <div className="relative mt-2">
                            <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-0 block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* Terms */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-0.5"
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    {/* Register Button */}
                    <PrimaryButton
                        className="w-full justify-center py-3 mt-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                        disabled={processing}
                    >
                        {processing ? 'Creating Account...' : 'Create Account'}
                    </PrimaryButton>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link
                        href={route('login')}
                        className="block text-center w-full py-2 px-4 border-2 border-purple-200 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        Sign In Instead
                    </Link>
                </form>

                {/* Help Text */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    🎓 Join thousands of learners achieving their goals with intelligent quizzes
                </p>
            </div>
        </GuestLayout>
    );
}
