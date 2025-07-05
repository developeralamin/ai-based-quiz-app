import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function QuizLayout({ children }) {
    return (
        <AuthenticatedLayout>
            {children}
        </AuthenticatedLayout>
    );
}