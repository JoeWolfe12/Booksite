import { useState } from "react";
import SignupForm from "@/features/auth/SignupForm";
import LoginForm from "@/features/auth/LoginForm";

export default function AuthLanding({ onAuth, onGuest }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-2">📚 Booksite</h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Record the books you read. Punces welcome
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "login" ? "Log In to Your Account" : "Create an Account"}
        </h2>

        {mode === "login" ? (
          <LoginForm onLogin={onAuth} />
        ) : (
          <SignupForm onSignup={onAuth} />
        )}

        <p className="text-center text-sm mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="underline text-blue-400 hover:text-blue-300"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="underline text-blue-400 hover:text-blue-300"
              >
                Log in
              </button>
            </>
          )}
        </p>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400 mb-2">Or</p>
          <button
            onClick={onGuest}
            className="text-blue-400 underline text-sm hover:text-blue-300"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}