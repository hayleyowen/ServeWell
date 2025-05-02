export const LoginButton = () => {
  return (
      <a href="api/auth/login" className="bg-blue-300 text-black p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 hover:bg-blue-400">
          <h3 className="text-xl font-bold mb-2">Login or Sign Up</h3>
      </a>
  );
};