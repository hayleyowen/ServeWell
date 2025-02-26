export const LoginButton = () => {
  return (
      <a href="api/auth/login" className="bg-blue-600 text-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 hover:bg-blue-700">
          <h3 className="text-xl font-bold mb-2">Login</h3>
      </a>
  );
};