import ChurchCreationForm from '../components/forms/ChurchCreationForm';

export default function ChurchCreationPage() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 pt-40">
            <div className="w-full max-w-md">
                <ChurchCreationForm />
            </div>
        </section>
    );
}
