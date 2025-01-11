import ChurchCreationForm from './components/ChurchCreationForm';

export default function ChurchCreationPage() {
    return (
        <div className="container mx-auto">
            <ChurchCreationForm />
            <div className="mt-4">
                <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
            </div>
        </div>
    );
}
